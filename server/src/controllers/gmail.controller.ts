import type { NextFunction, Request, Response } from "express";
import { getAuthUrl, handleCallback, getGmailStatus, disconnectGmail } from "../services/gmail.service";

export const connectGmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const url = getAuthUrl(userId);
        res.status(200).json({ success: true, url });
    } catch (error) {
        next(error);
    }
};

export const gmailCallbackHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, state: userId } = req.query as { code: string; state: string };
        if (!code || !userId) {
            res.status(400).json({ success: false, message: "Missing code or state" });
            return;
        }

        const { gmailEmail } = await handleCallback(code, userId);
        // Redirect to frontend with success
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.redirect(`${frontendUrl}/dashboard?gmail_connected=true&email=${gmailEmail}`);
    } catch (error) {
        next(error);
    }
};

export const gmailStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const status = await getGmailStatus(userId);
        res.status(200).json({ success: true, data: status });
    } catch (error) {
        next(error);
    }
};

export const disconnectGmailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        await disconnectGmail(userId);
        res.status(200).json({ success: true, message: "Gmail disconnected successfully" });
    } catch (error) {
        next(error);
    }
};
