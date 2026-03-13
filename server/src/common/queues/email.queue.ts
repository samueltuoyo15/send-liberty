import { Queue } from "bullmq";
import { redis } from "../config/redis.config";

export interface EmailJobPayload {
    userId: string;
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
    // For scheduled/tracked jobs
    scheduledEmailId?: string;
    batchJobId?: string;
    batchChunkIndex?: number;
}

export const emailQueue = new Queue<EmailJobPayload>("email-jobs", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});

export const addEmailJob = async (
    payload: EmailJobPayload,
    opts: { delay?: number; attempts?: number; jobId?: string } = {}
) => {
    return emailQueue.add("send-email", payload, {
        delay: opts.delay,
        jobId: opts.jobId,
        attempts: opts.attempts ?? 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
    });
};

export const addBatchEmailJobs = async (
    chunks: EmailJobPayload[][],
    batchDelayMs: number,
    maxRetries: number,
    scheduledAt?: Date
): Promise<string[]> => {
    const jobIds: string[] = [];
    const now = Date.now();
    const baseDelay = scheduledAt ? Math.max(scheduledAt.getTime() - now, 0) : 0;

    for (let i = 0; i < chunks.length; i++) {
        for (const payload of chunks[i]) {
            const delay = baseDelay + i * batchDelayMs;
            const job = await emailQueue.add("send-email", payload, {
                delay,
                attempts: maxRetries,
                backoff: { type: "exponential", delay: 2000 },
            });
            jobIds.push(job.id!);
        }
    }
    return jobIds;
};
