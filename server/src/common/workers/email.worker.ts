import { Worker, Job } from "bullmq";
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

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const selectEmailProvider = async (userId: string, requestedService?: "gmail" | "smtp") => {
    switch (requestedService) {
        case "smtp":
            return "smtp";
        
        case "gmail": {
            const [gmailAccount] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
            if (!gmailAccount?.connected) throw new Error("Gmail not connected");
            return "gmail";
        }
        
        default: {
            const [gmailAccount] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
            if (gmailAccount?.connected) return "gmail";
            
            const [smtpAccount] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
            if (smtpAccount) return "smtp";
            
            throw new Error("No email provider configured");
        }
    }
};

const sendEmailViaProvider = async (provider: "gmail" | "smtp", userId: string, payload: EmailJobPayload) => {
    switch (provider) {
        case "gmail":
            return await sendGmailEmail(userId, payload);
        case "smtp":
            return await sendSmtpEmail(userId, payload);
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
};

const logEmail = async (userId: string, payload: EmailJobPayload, status: "sent" | "failed", messageId?: string | null, error?: string) => {
    await db.insert(email_logs).values({
        user_id: userId,
        to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
        subject: payload.subject,
        status,
        service_type: payload.service === "smtp" ? "smtp" : "gmail",
        message_id: messageId ?? null,
        error_message: error,
    }).catch(() => {});
};

const deductCredit = async (userId: string) => {
    await db.update(users)
        .set({ 
            credits: sql`${users.credits} - 1`, 
            monthly_usage: sql`${users.monthly_usage} + 1`, 
            updated_at: new Date() 
        })
        .where(eq(users.id, userId));
};

const updateScheduledEmail = async (scheduledEmailId: string, status: "sent" | "failed", attempts: number, error?: string) => {
    await db.update(scheduled_emails)
        .set({
            status,
            attempts,
            error_message: error,
            updated_at: new Date(),
        })
        .where(eq(scheduled_emails.id, scheduledEmailId))
        .catch(() => {});
};

const updateBatchJob = async (batchJobId: string, type: "sent" | "failed") => {
    const field = type === "sent" ? batch_jobs.sent_count : batch_jobs.failed_count;
    
    await db.update(batch_jobs)
        .set({
            [type === "sent" ? "sent_count" : "failed_count"]: sql`${field} + 1`,
            updated_at: new Date(),
        })
        .where(eq(batch_jobs.id, batchJobId))
        .catch(() => {});
};

const processEmail = async (jobData: EmailJobPayload) => {
    const { userId } = jobData;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("User not found");

    const provider = await selectEmailProvider(userId, jobData.service);
    const result = await sendEmailViaProvider(provider, userId, jobData);
    
    await logEmail(userId, jobData, "sent", result.messageId);
    await deductCredit(userId);
    
    return result;
};

export const emailWorker = new Worker<EmailJobPayload>(
    "email-jobs",
    async (job: Job<EmailJobPayload>) => {
        const { userId, scheduledEmailId, batchJobId } = job.data;
        
        logger.info(`Processing email job ${job.id} for user ${userId}`);

        try {
            const result = await processEmail(job.data);

            if (scheduledEmailId) {
                await updateScheduledEmail(scheduledEmailId, "sent", (job.attemptsMade ?? 0) + 1);
            }

            if (batchJobId) {
                await updateBatchJob(batchJobId, "sent");
            }

            return result;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(`Email job ${job.id} failed: ${errMsg}`);

            const failedPayload: EmailJobPayload = { ...job.data, userId };
            await logEmail(userId, failedPayload, "failed", null, errMsg);

            throw error;
        }
    },
    {
        connection: {
            host: REDIS_HOST,
            port: Number(REDIS_PORT),
            password: REDIS_PASSWORD || undefined,
        },
        concurrency: 5,
    }
);

emailWorker.on("completed", (job) => {
    logger.info(`Email job ${job.id} completed`);
});

emailWorker.on("failed", async (job, err) => {
    logger.error(`Email job ${job?.id} permanently failed: ${err.message}`);

    if (job?.data.scheduledEmailId) {
        await updateScheduledEmail(job.data.scheduledEmailId, "failed", job.attemptsMade, err.message);
    }

    if (job?.data.batchJobId) {
        await updateBatchJob(job.data.batchJobId, "failed");
    }
});

export default emailWorker;
