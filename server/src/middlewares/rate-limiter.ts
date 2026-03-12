import type { Request, Response, NextFunction } from "express";
import { redis } from "../common/config/redis.config";
import { AppError } from "./global.error.handler";

const createRateLimiter = (opts: {
    keyPrefix: string;
    windowSeconds: number;
    maxRequests: number;
    message: string;
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const identifier =
            req.user?.id ??
            (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
            req.ip ??
            "unknown";

        const key = `${opts.keyPrefix}:${identifier}`;

        try {
            const current = await redis.incr(key);
            if (current === 1) {
                await redis.expire(key, opts.windowSeconds);
            }
            if (current > opts.maxRequests) {
                const ttl = await redis.ttl(key);
                res.set("Retry-After", String(ttl));
                return next(new AppError(opts.message, 429));
            }
            next();
        } catch {
            next();
        }
    };
};

export const apiSendRateLimiter = createRateLimiter({
    keyPrefix: "rl:send",
    windowSeconds: 60,
    maxRequests: 30,
    message: "Rate limit exceeded. Max 30 emails per minute.",
});

export const ipRateLimiter = createRateLimiter({
    keyPrefix: "rl:ip",
    windowSeconds: 60,
    maxRequests: 60,
    message: "Too many requests from this IP. Please slow down.",
});
