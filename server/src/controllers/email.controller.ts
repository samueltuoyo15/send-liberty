import type { NextFunction, Request, Response } from "express";
import { sendEmail, getEmailLogs } from "../services/email.service";

export const sendEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { service, to, subject, text, html, replyTo, cc, bcc, from } = req.body;
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
