import type { Request, Response, NextFunction } from "express";
import { verifyApiKey } from "../services/api-key.service";
import { AppError } from "./global.error.handler";

export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("API key required. Use: Authorization: Bearer <your_api_key>", 401));
    }

    const rawKey = authHeader.replace("Bearer ", "").trim();

    try {
        const user = await verifyApiKey(rawKey);
        req.user = { id: user.id, email: user.email, display_name: user.display_name };
        next();
    } catch (error) {
        next(error);
    }
};
