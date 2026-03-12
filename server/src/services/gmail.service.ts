import nodemailer from "nodemailer";
import { google } from "googleapis";
import db from "../drizzle/db";
import { gmail_accounts } from "../drizzle/schema/gmail.accounts";
import { email_logs } from "../drizzle/schema/email.logs";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "../common/lib/encryption";
import { AppError } from "../middlewares/global.error.handler";
import logger from "../common/logger/logger";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL)
    throw new Error("Google auth credentials are missing");

const createOAuthClient = () =>
    new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

export const getAuthUrl = (userId: string) => {
    const oauth2Client = createOAuthClient();
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/gmail.send", "email"],
        state: userId,
    });
};

export const handleCallback = async (code: string, userId: string) => {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) throw new AppError("Failed to get access token from Google", 400);
    if (!tokens.refresh_token) throw new AppError("No refresh token. Please revoke app access in Google settings and try again.", 400);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();
    const gmailEmail = userInfo.data.email;

    if (!gmailEmail) throw new AppError("Failed to get Gmail email from Google", 400);

    const encryptedAccessToken = encrypt(tokens.access_token);
    const encryptedRefreshToken = encrypt(tokens.refresh_token);
    const tokenExpiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : new Date(Date.now() + 3600 * 1000);

    const existing = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));

    if (existing.length > 0) {
        await db.update(gmail_accounts)
            .set({
                gmail_email: gmailEmail,
                encrypted_access_token: encryptedAccessToken,
                encrypted_refresh_token: encryptedRefreshToken,
                token_expires_at: tokenExpiresAt,
                connected: true,
                last_error: null,
                updated_at: new Date(),
            })
            .where(eq(gmail_accounts.user_id, userId));
    } else {
        await db.insert(gmail_accounts).values({
            user_id: userId,
            gmail_email: gmailEmail,
            encrypted_access_token: encryptedAccessToken,
            encrypted_refresh_token: encryptedRefreshToken,
            token_expires_at: tokenExpiresAt,
            connected: true,
        });
    }

    logger.info(`Gmail account connected for user ${userId}: ${gmailEmail}`);
    return { gmailEmail };
};

const getGmailAccount = async (userId: string) => {
    const [account] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
    if (!account) throw new AppError("No Gmail account connected. Please connect Gmail first.", 400);
    if (!account.connected) throw new AppError("Gmail account is disconnected. Please reconnect.", 400);
    return account;
};

const refreshAccessTokenIfNeeded = async (account: typeof gmail_accounts.$inferSelect) => {
    const bufferMs = 5 * 60 * 1000;
    const now = new Date();

    if (account.token_expires_at.getTime() - bufferMs > now.getTime()) {
        return decrypt(account.encrypted_access_token);
    }

    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: decrypt(account.encrypted_refresh_token) });

    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        if (!credentials.access_token) throw new Error("Refresh returned no access token");

        await db.update(gmail_accounts)
            .set({
                encrypted_access_token: encrypt(credentials.access_token),
                token_expires_at: credentials.expiry_date
                    ? new Date(credentials.expiry_date)
                    : new Date(Date.now() + 3600 * 1000),
                updated_at: new Date(),
            })
            .where(eq(gmail_accounts.id, account.id));

        return credentials.access_token;
    } catch (err) {
        await db.update(gmail_accounts)
            .set({ connected: false, last_error: String(err), updated_at: new Date() })
            .where(eq(gmail_accounts.id, account.id));
        throw new AppError("Gmail token refresh failed. Please reconnect your Gmail account.", 401);
    }
};

export type GmailSendOptions = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
};

export const sendGmailEmail = async (userId: string, options: GmailSendOptions) => {
    const account = await getGmailAccount(userId);
    const accessToken = await refreshAccessTokenIfNeeded(account);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: account.gmail_email,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            accessToken,
        },
    });

    const toAddress = Array.isArray(options.to) ? options.to.join(", ") : options.to;

    try {
        const info = await transporter.sendMail({
            from: options.from ?? account.gmail_email,
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
            service_type: "gmail",
            message_id: info.messageId,
        });

        return { messageId: info.messageId };
    } catch (err: any) {
        await db.insert(email_logs).values({
            user_id: userId,
            to: toAddress,
            subject: options.subject,
            status: "failed",
            service_type: "gmail",
            error_message: err?.message ?? "Unknown error",
        });
        throw new AppError(`Failed to send email via Gmail: ${err?.message}`, 500);
    }
};

export const getGmailStatus = async (userId: string) => {
    const [account] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
    if (!account) return { connected: false, email: null };
    return {
        connected: account.connected,
        email: account.gmail_email,
        lastError: account.last_error,
    };
};

export const disconnectGmail = async (userId: string) => {
    const [account] = await db.select().from(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
    if (!account) throw new AppError("No Gmail account connected", 404);

    try {
        const oauth2Client = createOAuthClient();
        oauth2Client.setCredentials({ access_token: decrypt(account.encrypted_access_token) });
        await oauth2Client.revokeCredentials();
    } catch {
        logger.warn(`Failed to revoke Gmail token for user ${userId}`);
    }

    await db.delete(gmail_accounts).where(eq(gmail_accounts.user_id, userId));
};
