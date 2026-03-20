import { request } from "./http";
import type { SendLibertyConfig, SendOptions, SendResult, Service, BatchOptions, BatchResult } from "./types";
import { SendLibertyError } from "./error";

const DEFAULT_BASE_URL = "https://api.sendliberty.com";

export class SendLiberty {
    private readonly apiKey: string;
    private readonly service?: Service;
    private readonly baseUrl: string;

    constructor(config: SendLibertyConfig) {
        if (!config.auth?.apiKey) {
            throw new SendLibertyError("API key is required in auth.apiKey", 400);
        }
        this.apiKey = config.auth.apiKey;
        this.service = config.service;
        this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
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
            baseUrl: this.baseUrl,
            body: {
                service: this.service,
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
            baseUrl: this.baseUrl,
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
