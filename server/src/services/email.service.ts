import { sendGmailEmail } from "./gmail.service";
import { sendSmtpEmail } from "./smtp.service";
import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { gmail_accounts } from "../drizzle/schema/gmail.accounts";
import { smtp_config } from "../drizzle/schema/smtp.config";
import { email_logs } from "../drizzle/schema/email.logs";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";

export type SendEmailOptions = {
    service?: "gmail" | "smtp";
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
    attachments?: Array<{ filename: string; content: string; contentType?: string; encoding?: string }>;
    headers?: Record<string, string>;
};

export const sendEmail = async (userId: string, options: SendEmailOptions) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new AppError("User not found", 404);

    if (user.mode === "test_mode" && user.monthly_usage >= user.monthly_limit) {
        throw new AppError(
            `Monthly email limit reached (${user.monthly_limit}). Switch to live mode or wait for reset.`,
            429
        );
    }

    const requestedService = options.service;
    let result: { messageId: string | null | undefined };

    if (requestedService === "smtp") {
        result = await sendSmtpEmail(userId, options);
    } else {
        const [gmailAccount] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));

        if (gmailAccount?.connected) {
            result = await sendGmailEmail(userId, options);
        } else if (!requestedService) {
            const [smtpAccount] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
            if (smtpAccount) {
                result = await sendSmtpEmail(userId, options);
            } else {
                throw new AppError(
                    "No email provider configured. Please connect Gmail or configure SMTP first.",
                    400
                );
            }
        } else {
            throw new AppError("Gmail is not connected. Please connect Gmail first.", 400);
        }
    }

    await db.update(users)
        .set({ monthly_usage: user.monthly_usage + 1, updated_at: new Date() })
        .where(eq(users.id, userId));

    return result;
};

export const getEmailLogs = async (userId: string, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return db.select().from(email_logs)
        .where(eq(email_logs.user_id, userId))
        .limit(limit)
        .offset(offset)
        .orderBy(email_logs.created_at);
};
