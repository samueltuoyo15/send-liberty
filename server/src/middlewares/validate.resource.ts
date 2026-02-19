import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export type RequestSchema = z.ZodObject<{
    body: z.ZodType;
    query?: z.ZodType;
    params?: z.ZodType;
}>;


export const validateResource =
    <T extends RequestSchema>(schema: T) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsed = await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                req.body = parsed.body;
                req.query = parsed.query;
                req.params = parsed.params;

                return next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        message: error.issues.map((e) => e.message).join(", "),
                    });
                }
                return next(error);
            }
        };
