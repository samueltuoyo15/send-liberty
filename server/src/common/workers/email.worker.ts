import { Worker, Job } from "bullmq";
import { redis } from "../config/redis.config";
import { sendGmailEmail } from "../../services/gmail.service";
import { sendSmtpEmail } from "../../services/smtp.service";
import db from "../../drizzle/db";
import { users } from "../../drizzle/schema/users";
import { gmail_accounts } from "../../drizzle/schema/gmail.accounts";
import { smtp_config } from "../../drizzle/schema/smtp.config";
import { email_logs } from "../../drizzle/schema/email.logs";
import { scheduled_emails } from "../../drizzle/schema/scheduled_emails";
import { batch_jobs } from "../../drizzle/schema/batch_jobs";
import { eq, sql } from "drizzle-orm";
import logger from "../logger/logger";
import type { EmailJobPayload } from "../queues/email.queue";

const processEmail = async (userId: string, payload: EmailJobPayload) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("User not found");

    const service = payload.service;
    let result: { messageId: string | null | undefined };

    if (service === "smtp") {
        result = await sendSmtpEmail(userId, payload);
    } else {
        const [gmailAccount] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
        if (gmailAccount?.connected) {
            result = await sendGmailEmail(userId, payload);
        } else {
            const [smtpAccount] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
            if (smtpAccount) {
                result = await sendSmtpEmail(userId, payload);
            } else {
                throw new Error("No email provider configured");
            }
        }
    }

    // Log the successful send
    await db.insert(email_logs).values({
        user_id: userId,
        to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
        subject: payload.subject,
        status: "sent",
        service_type: service === "smtp" ? "smtp" : "gmail",
        message_id: result.messageId ?? null,
    });

    // Deduct credit
    await db.update(users)
        .set({ credits: sql`${users.credits} - 1`, monthly_usage: sql`${users.monthly_usage} + 1`, updated_at: new Date() })
        .where(eq(users.id, userId));

    return result;
};

export const emailWorker = new Worker<EmailJobPayload>(
    "email-jobs",
    async (job: Job<EmailJobPayload>) => {
        const { userId, scheduledEmailId, batchJobId, batchChunkIndex, ...payload } = job.data;
        logger.info(`Processing email job ${job.id} for user ${userId}`);

        try {
            const result = await processEmail(userId, { userId, ...payload });

            // Update scheduled email status if applicable
            if (scheduledEmailId) {
                await db.update(scheduled_emails).set({
                    status: "sent",
                    attempts: (job.attemptsMade ?? 0) + 1,
                    updated_at: new Date(),
                }).where(eq(scheduled_emails.id, scheduledEmailId));
            }

            // Update batch job progress
            if (batchJobId) {
                await db.update(batch_jobs).set({
                    sent_count: sql`${batch_jobs.sent_count} + 1`,
                    updated_at: new Date(),
                }).where(eq(batch_jobs.id, batchJobId));
            }

            return result;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(`Email job ${job.id} failed: ${errMsg}`);

            // Log failed email
            await db.insert(email_logs).values({
                user_id: userId,
                to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
                subject: payload.subject,
                status: "failed",
                service_type: payload.service === "smtp" ? "smtp" : "gmail",
                error_message: errMsg,
            }).catch(() => {});

            throw error; // re-throw so BullMQ retries
        }
    },
    {
        connection: redis,
        concurrency: 5,
    }
);

emailWorker.on("completed", (job) => {
    logger.info(`Email job ${job.id} completed`);
});

emailWorker.on("failed", async (job, err) => {
    logger.error(`Email job ${job?.id} permanently failed: ${err.message}`);

    // Mark scheduled email as failed after all retries exhausted
    if (job?.data.scheduledEmailId) {
        await db.update(scheduled_emails).set({
            status: "failed",
            error_message: err.message,
            updated_at: new Date(),
        }).where(eq(scheduled_emails.id, job.data.scheduledEmailId)).catch(() => {});
    }

    // Increment batch failed count
    if (job?.data.batchJobId) {
        await db.update(batch_jobs).set({
            failed_count: sql`${batch_jobs.failed_count} + 1`,
            updated_at: new Date(),
        }).where(eq(batch_jobs.id, job.data.batchJobId)).catch(() => {});
    }
});

export default emailWorker;
