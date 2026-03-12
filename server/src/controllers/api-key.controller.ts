import type { NextFunction, Request, Response } from "express";
import { generateApiKey, listApiKeys, revokeApiKey, deleteApiKey } from "../services/api-key.service";

export const generateApiKeyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { label } = req.body;
        const result = await generateApiKey(userId, label);

        res.status(201).json({
            success: true,
            message: "API key created. Save it now — it won't be shown again.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const listApiKeysHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const keys = await listApiKeys(userId);
        res.status(200).json({ success: true, data: keys });
    } catch (error) {
        next(error);
    }
};

export const revokeApiKeyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const id = String(req.params.id);
        await revokeApiKey(userId, id);
        res.status(200).json({ success: true, message: "API key revoked" });
    } catch (error) {
        next(error);
    }
};

export const deleteApiKeyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const id = String(req.params.id);
        await deleteApiKey(userId, id);
        res.status(200).json({ success: true, message: "API key deleted" });
    } catch (error) {
        next(error);
    }
};
