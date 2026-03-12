export type Service = "gmail" | "smtp";

export type Attachment = {
    filename: string;
    content: string | Buffer;
    contentType?: string;
    encoding?: "base64" | "utf8" | "binary" | "hex";
};

export type SendOptions = {
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
};

export type SendResult = {
    success: boolean;
    messageId: string | null;
};

export type SendLibertyConfig = {
    auth: {
        apiKey: string;
    };
    service?: Service;
    baseUrl?: string;
};
