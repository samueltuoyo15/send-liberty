import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { gmail_accounts } from "../drizzle/schema/gmail.accounts";
import { smtp_config } from "../drizzle/schema/smtp.config";
import { email_logs } from "../drizzle/schema/email.logs";
import { scheduled_emails } from "../drizzle/schema/scheduled_emails";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";
import { sendGmailEmail } from "./gmail.service";
import { sendSmtpEmail } from "./smtp.service";
import { addEmailJob } from "../common/queues/email.queue";

export type SendEmailOptions = {
    service?: "gmail" | "smtp";
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
    attachments?: Array<{ filename: string; content: string; contentType?: string; encoding?: string }>;
    headers?: Record<string, string>;
};

/** Immediately send a single email (used by worker + direct API calls for non-scheduled) */
export const sendEmail = async (userId: string, options: SendEmailOptions) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new AppError("User not found", 404);

    if (user.credits <= 0) {
        throw new AppError("Insufficient credits. Please top up to continue sending emails.", 402);
    }

    const requestedService = options.service;
    let result: { messageId: string | null | undefined };

    if (requestedService === "smtp") {
        result = await sendSmtpEmail(userId, options);
    } else {
        const [gmailAccount] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));

        if (gmailAccount?.connected) {
            result = await sendGmailEmail(userId, options);
        } else if (!requestedService) {
            const [smtpAccount] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
            if (smtpAccount) {
                result = await sendSmtpEmail(userId, options);
            } else {
                throw new AppError("No email provider configured. Please connect Gmail or configure SMTP first.", 400);
            }
        } else {
            throw new AppError("Gmail is not connected. Please connect Gmail first.", 400);
        }
    }

    await db.update(users)
        .set({ monthly_usage: user.monthly_usage + 1, credits: user.credits - 1, updated_at: new Date() })
        .where(eq(users.id, userId));

    return result;
};

/** Schedule an email to be sent at a future time, with optional retry */
export const scheduleEmail = async (
    userId: string,
    options: SendEmailOptions,
    scheduledAt: Date,
    maxRetries = 3
) => {
    // Insert pending record first to get an ID
    const [scheduled] = await db.insert(scheduled_emails).values({
        user_id: userId,
        to: JSON.stringify(options.to),
        subject: options.subject,
        html: options.html,
        body: options.text,
        cc: options.cc ? JSON.stringify(options.cc) : null,
        bcc: options.bcc ? JSON.stringify(options.bcc) : null,
        reply_to: options.replyTo,
        service: options.service ?? "gmail",
        scheduled_at: scheduledAt,
        max_retries: maxRetries,
        status: "pending",
    }).returning();

    const delayMs = Math.max(scheduledAt.getTime() - Date.now(), 0);

    const job = await addEmailJob(
        {
            userId,
            scheduledEmailId: scheduled.id,
            ...options,
        },
        { delay: delayMs, attempts: maxRetries }
    );

    // Save job ID for cancellation
    await db.update(scheduled_emails).set({ job_id: job.id }).where(eq(scheduled_emails.id, scheduled.id));

    return scheduled;
};

/** List scheduled emails for a user */
export const getScheduledEmails = async (userId: string, status?: string) => {
    const query = db.select().from(scheduled_emails).where(eq(scheduled_emails.user_id, userId));
    return query.orderBy(scheduled_emails.scheduled_at);
};

/** Cancel a pending scheduled email */
export const cancelScheduledEmail = async (userId: string, scheduledEmailId: string) => {
    const [scheduled] = await db.select().from(scheduled_emails)
        .where(eq(scheduled_emails.id, scheduledEmailId));

    if (!scheduled || scheduled.user_id !== userId) {
        throw new AppError("Scheduled email not found", 404);
    }
    if (scheduled.status !== "pending") {
        throw new AppError("Only pending scheduled emails can be cancelled", 400);
    }

    // Remove from BullMQ
    if (scheduled.job_id) {
        const { emailQueue } = await import("../common/queues/email.queue");
        const job = await emailQueue.getJob(scheduled.job_id);
        if (job) await job.remove();
    }

    await db.update(scheduled_emails).set({ status: "cancelled", updated_at: new Date() })
        .where(eq(scheduled_emails.id, scheduledEmailId));

    return { success: true };
};

/** Reschedule an existing pending email */
export const rescheduleEmail = async (userId: string, scheduledEmailId: string, newScheduledAt: Date) => {
    const [scheduled] = await db.select().from(scheduled_emails)
        .where(eq(scheduled_emails.id, scheduledEmailId));

    if (!scheduled || scheduled.user_id !== userId) throw new AppError("Scheduled email not found", 404);
    if (scheduled.status !== "pending") throw new AppError("Only pending emails can be rescheduled", 400);

    // Remove old job
    if (scheduled.job_id) {
        const { emailQueue } = await import("../common/queues/email.queue");
        const oldJob = await emailQueue.getJob(scheduled.job_id);
        if (oldJob) await oldJob.remove();
    }

    const delay = Math.max(newScheduledAt.getTime() - Date.now(), 0);
    const job = await addEmailJob(
        {
            userId,
            scheduledEmailId: scheduled.id,
            to: JSON.parse(scheduled.to),
            subject: scheduled.subject,
            html: scheduled.html ?? undefined,
            text: scheduled.body ?? undefined,
            service: (scheduled.service ?? "gmail") as "gmail" | "smtp",
        },
        { delay, attempts: scheduled.max_retries }
    );

    await db.update(scheduled_emails).set({
        scheduled_at: newScheduledAt,
        job_id: job.id,
        updated_at: new Date(),
    }).where(eq(scheduled_emails.id, scheduledEmailId));

    return { success: true, newScheduledAt };
};

export const getEmailLogs = async (userId: string, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return db.select().from(email_logs)
        .where(eq(email_logs.user_id, userId))
        .limit(limit)
        .offset(offset)
        .orderBy(email_logs.created_at);
};
