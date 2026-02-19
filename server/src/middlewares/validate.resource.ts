import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateResource =
    (schema: ZodType) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                return next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        message: error.issues.map(e => e.message).join(", "),
                    });
                }
                return next(error);
            }
        };
