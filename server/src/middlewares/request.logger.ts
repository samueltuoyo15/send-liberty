import type { Request, Response, NextFunction } from "express";
import logger from "../common/logger/logger";

declare module "express" {
    interface Request {
        timestamp?: string;
    }
}

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get("User-Agent");

    logger.info(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);

    next();
};

export const addTimestamp = (req: Request, res: Response, next: NextFunction) => {
    req.timestamp = req.timestamp || new Date().toISOString();
    next();
};