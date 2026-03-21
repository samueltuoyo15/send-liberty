export type Service = "gmail" | "smtp";

export type Attachment = {
    filename: string;
    content: string | Buffer;
    contentType?: string;
    encoding?: "base64" | "utf8" | "binary" | "hex";
};

export type SendOptions = {
    service?: Service;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
    attachments?: Attachment[];
    headers?: Record<string, string>;
    scheduledAt?: Date | string;
    maxRetries?: number;
};

export type BatchRecipient = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
};

export type BatchOptions = {
    recipients: BatchRecipient[];
    batchSize?: number;
    batchDelayMs?: number;
    maxRetries?: number;
    scheduledAt?: Date | string;
    name?: string;
};

export type SendResult = {
    success: boolean;
    messageId?: string | null;
    message?: string;
};

export type BatchResult = {
    success: boolean;
    message: string;
    data: {
        id: string;
        name?: string;
        total_count: number;
        status: string;
    };
};
