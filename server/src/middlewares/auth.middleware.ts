import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./global.error.handler";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT secret is missing");

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.cookies?.access_token ??
        req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return next(new AppError("Authentication required", 401));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as {
            id: string;
            email: string;
            display_name: string | null;
        };
        req.user = decoded;
        next();
    } catch {
        next(new AppError("Invalid or expired token", 401));
    }
};
