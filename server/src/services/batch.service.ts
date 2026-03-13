import db from "../drizzle/db";
import { batch_jobs } from "../drizzle/schema/batch_jobs";
import { email_logs } from "../drizzle/schema/email.logs";
import { eq, sql } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";
import { addBatchEmailJobs, emailQueue } from "../common/queues/email.queue";
import type { SendEmailOptions } from "./email.service";

export interface BatchRecipient extends SendEmailOptions {
    to: string;
}

export interface BatchConfig {
    batchSize?: number;
    batchDelayMs?: number;
    maxRetries?: number;
    scheduledAt?: Date;
    name?: string;
}

const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

/** Create and enqueue a batch email job */
export const scheduleBatch = async (
    userId: string,
    recipients: BatchRecipient[],
    config: BatchConfig = {}
) => {
    const {
        batchSize = 50,
        batchDelayMs = 1000,
        maxRetries = 3,
        scheduledAt,
        name,
    } = config;

    if (!recipients.length) throw new AppError("Recipients array cannot be empty", 400);
    if (recipients.length > 10000) throw new AppError("Maximum 10,000 recipients per batch", 400);

    // Create batch job record
    const [batchJob] = await db.insert(batch_jobs).values({
        user_id: userId,
        name: name ?? `Batch ${new Date().toISOString()}`,
        total_count: recipients.length,
        batch_size: batchSize,
        batch_delay_ms: batchDelayMs,
        max_retries: maxRetries,
        scheduled_at: scheduledAt,
        status: "pending",
    }).returning();

    // Chunk recipients
    const chunks = chunkArray(recipients, batchSize);

    // Map to BullMQ payloads
    const chunkPayloads = chunks.map((chunk, i) =>
        chunk.map((r) => ({
            userId,
            batchJobId: batchJob.id,
            batchChunkIndex: i,
            ...r,
        }))
    );

    const jobIds = await addBatchEmailJobs(chunkPayloads, batchDelayMs, maxRetries, scheduledAt);

    await db.update(batch_jobs).set({
        job_ids: JSON.stringify(jobIds),
        status: scheduledAt ? "pending" : "running",
        started_at: scheduledAt ? null : new Date(),
        updated_at: new Date(),
    }).where(eq(batch_jobs.id, batchJob.id));

    return { ...batchJob, jobIds };
};

/** List a user's batch jobs */
export const getBatchJobs = async (userId: string) => {
    return db.select().from(batch_jobs)
        .where(eq(batch_jobs.user_id, userId))
        .orderBy(batch_jobs.created_at);
};

/** Get a single batch job's details */
export const getBatchJob = async (userId: string, batchJobId: string) => {
    const [job] = await db.select().from(batch_jobs)
        .where(eq(batch_jobs.id, batchJobId));

    if (!job || job.user_id !== userId) throw new AppError("Batch job not found", 404);
    return job;
};

/** Cancel an in-flight or pending batch job */
export const cancelBatchJob = async (userId: string, batchJobId: string) => {
    const [job] = await db.select().from(batch_jobs).where(eq(batch_jobs.id, batchJobId));

    if (!job || job.user_id !== userId) throw new AppError("Batch job not found", 404);
    if (!["pending", "running"].includes(job.status)) {
        throw new AppError("Batch job cannot be cancelled at this stage", 400);
    }

    // Remove all queued jobs
    if (job.job_ids) {
        const ids: string[] = JSON.parse(job.job_ids);
        await Promise.allSettled(
            ids.map(async (id) => {
                const queueJob = await emailQueue.getJob(id);
                if (queueJob) await queueJob.remove();
            })
        );
    }

    await db.update(batch_jobs).set({
        status: "cancelled",
        updated_at: new Date(),
    }).where(eq(batch_jobs.id, batchJobId));

    return { success: true };
};
