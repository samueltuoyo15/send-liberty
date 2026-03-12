import type { NextFunction, Request, Response } from "express";
import { saveSmtpConfig, getSmtpConfig, deleteSmtpConfig, testSmtpConnection } from "../services/smtp.service";

export const saveSmtpConfigHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { host, port, secure, username, password, from_email } = req.body;
        const config = await saveSmtpConfig(userId, host, port, secure, username, password, from_email);
        res.status(200).json({ success: true, message: "SMTP config saved", data: config });
    } catch (error) {
        next(error);
    }
};

export const getSmtpConfigHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const config = await getSmtpConfig(userId);
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        next(error);
    }
};

export const deleteSmtpConfigHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        await deleteSmtpConfig(userId);
        res.status(200).json({ success: true, message: "SMTP config deleted" });
    } catch (error) {
        next(error);
    }
};

export const testSmtpHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await testSmtpConnection(userId);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};
