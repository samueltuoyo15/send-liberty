import nodemailer from "nodemailer";
import db from "../drizzle/db";
import { smtp_config } from "../drizzle/schema/smtp.config";
import { email_logs } from "../drizzle/schema/email.logs";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "../common/lib/encryption";
import { AppError } from "../middlewares/global.error.handler";
import logger from "../common/logger/logger";

export const saveSmtpConfig = async (
    userId: string,
    host: string,
    port: number,
    secure: boolean,
    username: string,
    password: string,
    from_email: string
) => {
    const encryptedPassword = encrypt(password);
    const existing = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));

    if (existing.length > 0) {
        const [updated] = await db.update(smtp_config)
            .set({ host, port, secure, username, encrypted_password: encryptedPassword, from_email, updated_at: new Date() })
            .where(eq(smtp_config.user_id, userId))
            .returning();
        return updated;
    }

    const [created] = await db.insert(smtp_config)
        .values({ user_id: userId, host, port, secure, username, encrypted_password: encryptedPassword, from_email })
        .returning();

    return created;
};

export const getSmtpConfig = async (userId: string) => {
    const [config] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
    if (!config) return null;
    const { encrypted_password, ...safeConfig } = config;
    return safeConfig;
};

export const deleteSmtpConfig = async (userId: string) => {
    const [config] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
    if (!config) throw new AppError("No SMTP config found", 404);
    await db.delete(smtp_config).where(eq(smtp_config.user_id, userId));
};

export const testSmtpConnection = async (userId: string) => {
    const [config] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
    if (!config) throw new AppError("No SMTP config found. Please configure SMTP first.", 400);

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.username, pass: decrypt(config.encrypted_password) },
    });

    await transporter.verify();
    return { success: true, message: "SMTP connection successful" };
};

export type SmtpSendOptions = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
};

export const sendSmtpEmail = async (userId: string, options: SmtpSendOptions) => {
    const [config] = await db.select().from(smtp_config).where(eq(smtp_config.user_id, userId));
    if (!config) throw new AppError("No SMTP config found. Please configure SMTP first.", 400);

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.username, pass: decrypt(config.encrypted_password) },
    });

    const toAddress = Array.isArray(options.to) ? options.to.join(", ") : options.to;

    try {
        const info = await transporter.sendMail({
            from: config.from_email,
            to: toAddress,
            subject: options.subject,
            text: options.text,
            html: options.html,
            replyTo: options.replyTo,
            cc: options.cc,
            bcc: options.bcc,
        });

        await db.insert(email_logs).values({
            user_id: userId,
            to: toAddress,
            subject: options.subject,
            status: "sent",
            service_type: "smtp",
            message_id: info.messageId,
        });

        logger.info(`SMTP email sent to ${toAddress} for user ${userId}`);
        return { messageId: info.messageId };
    } catch (err: any) {
        await db.insert(email_logs).values({
            user_id: userId,
            to: toAddress,
            subject: options.subject,
            status: "failed",
            service_type: "smtp",
            error_message: err?.message ?? "Unknown error",
        });
        throw new AppError(`Failed to send email via SMTP: ${err?.message}`, 500);
    }
};
