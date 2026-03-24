import type { NextFunction, Request, Response } from "express";
import { initializePayment, verifyPayment, handleWebhook, CREDIT_PACKAGES } from "../services/payment.service";
import crypto from "crypto";

export const initializePaymentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { packageId } = req.body;

        const result = await initializePayment(userId, packageId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const verifyPaymentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reference } = req.params;
        const referenceStr = Array.isArray(reference) ? reference[0] : reference;
        const user = await verifyPayment(referenceStr);
        res.status(200).json({ success: true, message: "Payment verified and credits added", data: user });
    } catch (error) {
        next(error);
    }
};

export const webhookHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
            .update(JSON.stringify(req.body))
            .digest("hex");

        const signature = req.headers["x-paystack-signature"];
        const signatureStr = Array.isArray(signature) ? signature[0] : signature;

        if (hash !== signatureStr) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        await handleWebhook(req.body);
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const getPackagesHandler = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const packages = Object.entries(CREDIT_PACKAGES).map(([id, pkg]) => ({
            id,
            credits: pkg.credits,
            amount: pkg.amount,
            amountNGN: pkg.amount / 100,
        }));
        res.status(200).json({ success: true, data: packages });
    } catch (error) {
        next(error);
    }
};
