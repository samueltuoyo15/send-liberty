import { z } from "zod";

export const smtpConfigSchema = z.object({
    body: z.object({
        host: z.string().min(1, "Host is required"),
        port: z.number().int().min(1).max(65535),
        secure: z.boolean(),
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
        from_email: z.string().email("Invalid from email"),
    }),
});
