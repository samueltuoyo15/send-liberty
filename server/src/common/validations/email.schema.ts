import { z } from "zod";

const emailOrArray = z.union([
    z.email(),
    z.array(z.string().email()).min(1),
]);

const attachmentSchema = z.object({
    filename: z.string().min(1),
    content: z.string().min(1),
    contentType: z.string().optional(),
    encoding: z.enum(["base64", "utf8", "binary", "hex"]).optional(),
});

export const sendEmailSchema = z.object({
    body: z.object({
        service: z.enum(["gmail", "smtp"]).optional(),
        to: z.union([z.email("Invalid recipient email"), z.array(z.string().email()).min(1)]),
        subject: z.string().min(1, "Subject is required").max(500),
        text: z.string().optional(),
        html: z.string().optional(),
        replyTo: z.email("Invalid replyTo email").optional(),
        cc: emailOrArray.optional(),
        bcc: emailOrArray.optional(),
        from: z.string().optional(),
        attachments: z.array(attachmentSchema).max(10, "Max 10 attachments").optional(),
        headers: z.record(z.string(), z.string()).optional(),
    }).refine((d) => d.text || d.html, {
        message: "Either text or html must be provided",
        path: ["html"],
    }),
});
