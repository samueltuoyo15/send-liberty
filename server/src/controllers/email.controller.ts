import type { NextFunction, Request, Response } from "express";
import {
    sendEmail,
    getEmailLogs,
    scheduleEmail,
    getScheduledEmails,
    cancelScheduledEmail,
    rescheduleEmail,
} from "../services/email.service";
import { scheduleBatch, getBatchJobs, getBatchJob, cancelBatchJob } from "../services/batch.service";

export const sendEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { service, to, subject, text, html, replyTo, cc, bcc, from, scheduledAt, maxRetries } = req.body;

        if (scheduledAt) {
            const scheduled = await scheduleEmail(
                userId,
                { service, to, subject, text, html, replyTo, cc, bcc, from },
                new Date(scheduledAt),
                maxRetries ?? 3
            );
            return res.status(202).json({ success: true, message: "Email scheduled", data: scheduled });
        }

        const result = await sendEmail(userId, { service, to, subject, text, html, replyTo, cc, bcc, from });
        res.status(200).json({ success: true, messageId: result.messageId });
    } catch (error) {
        next(error);
    }
};

export const getEmailLogsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const page = parseInt(String(req.query.page ?? "1"), 10);
        const limit = parseInt(String(req.query.limit ?? "20"), 10);
        const logs = await getEmailLogs(userId, page, limit);
        res.status(200).json({ success: true, data: logs, meta: { page, limit } });
    } catch (error) {
        next(error);
    }
};

export const getScheduledEmailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const status = req.query.status as string | undefined;
        const data = await getScheduledEmails(userId, status);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const cancelScheduledEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await cancelScheduledEmail(userId, req.params.id as string);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const rescheduleEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { scheduledAt } = req.body;
        const result = await rescheduleEmail(userId, req.params.id as string, new Date(scheduledAt));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const sendBatchEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { recipients, batchSize, batchDelayMs, maxRetries, scheduledAt, name } = req.body;
        const result = await scheduleBatch(userId, recipients, {
            batchSize, batchDelayMs, maxRetries,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
            name,
        });
        res.status(202).json({ success: true, message: "Batch job queued", data: result });
    } catch (error) {
        next(error);
    }
};

export const getBatchJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await getBatchJobs(req.user!.id);
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
};

export const getBatchJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const job = await getBatchJob(req.user!.id, req.params.id as string);
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
};

export const cancelBatchJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await cancelBatchJob(req.user!.id, req.params.id as string);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

