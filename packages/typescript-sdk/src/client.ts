import { request } from "./http";
import type { SendOptions, SendResult, BatchOptions, BatchResult } from "./types";
import { SendLibertyError } from "./error";

export class SendLiberty {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new SendLibertyError("API key is required", 400);
        }
        this.apiKey = apiKey;
    }

    async send(options: SendOptions): Promise<SendResult> {
        if (!options.to) {
            throw new SendLibertyError("to is required", 400);
        }
        if (!options.subject) {
            throw new SendLibertyError("subject is required", 400);
        }
        if (!options.text && !options.html) {
            throw new SendLibertyError("Either text or html must be provided", 400);
        }

        const attachments = options.attachments?.map((att) => ({
            filename: att.filename,
            content: Buffer.isBuffer(att.content)
                ? att.content.toString("base64")
                : att.content,
            contentType: att.contentType,
            encoding: att.encoding ?? (Buffer.isBuffer(att.content) ? "base64" : "utf8"),
        }));

        return request<SendResult>({
            method: "POST",
            path: "/api/v1/email/send",
            apiKey: this.apiKey,
            body: {
                service: options.service,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                replyTo: options.replyTo,
                cc: options.cc,
                bcc: options.bcc,
                from: options.from,
                attachments,
                headers: options.headers,
                scheduledAt: options.scheduledAt,
                maxRetries: options.maxRetries,
            },
        });
    }

    async sendBatch(options: BatchOptions): Promise<BatchResult> {
        if (!options.recipients || options.recipients.length === 0) {
            throw new SendLibertyError("recipients array is required and cannot be empty", 400);
        }

        return request<BatchResult>({
            method: "POST",
            path: "/api/v1/email/batch",
            apiKey: this.apiKey,
            body: {
                recipients: options.recipients,
                batchSize: options.batchSize,
                batchDelayMs: options.batchDelayMs,
                maxRetries: options.maxRetries,
                scheduledAt: options.scheduledAt,
                name: options.name,
            },
        });
    }
}

export default SendLiberty;
