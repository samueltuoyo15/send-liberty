import { z } from "zod";

export const sendEmailSchema = z.object({
    body: z.object({
        service: z.enum(["gmail", "smtp"]).optional(),
        to: z.union([
            z.string().email("Invalid recipient email"),
            z.array(z.string().email("Invalid recipient email")).min(1),
        ]),
        subject: z.string().min(1, "Subject is required").max(500),
        text: z.string().optional(),
        html: z.string().optional(),
        replyTo: z.string().email("Invalid replyTo email").optional(),
        cc: z.union([
            z.string().email(),
            z.array(z.string().email()),
        ]).optional(),
        bcc: z.union([
            z.string().email(),
            z.array(z.string().email()),
        ]).optional(),
        from: z.string().optional(),
    }).refine((d) => d.text || d.html, {
        message: "Either text or html must be provided",
        path: ["html"],
    }),
});
