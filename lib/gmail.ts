import { google } from "googleapis";
import { encrypt, decrypt } from "./encryption";
import { connectDB } from "./db";
import GmailAccount from "@/models/GmailAccount";
import EmailLog from "@/models/EmailLog";
import MailComposer from "nodemailer/lib/mail-composer";
import mongoose from "mongoose";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GMAIL_CALLBACK_URL } = process.env;

export function createOAuthClient(redirectUri?: string) {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri || GMAIL_CALLBACK_URL
  );
}

export function getGmailAuthUrl(userId: string): string {
  const oauth2Client = createOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent select_account",
    scope: ["https://www.googleapis.com/auth/gmail.send", "email"],
    state: userId,
  });
}

export async function handleGmailCallback(code: string, userId: string) {
  await connectDB();
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token) throw new Error("Failed to get access token from Google");
  if (!tokens.refresh_token)
    throw new Error(
      "No refresh token. Please revoke app access in Google settings and try again."
    );

  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
  const userInfo = await oauth2.userinfo.get();
  const gmailEmail = userInfo.data.email;
  if (!gmailEmail) throw new Error("Failed to get Gmail email from Google");

  const tokenExpiresAt = tokens.expiry_date
    ? new Date(tokens.expiry_date)
    : new Date(Date.now() + 3600 * 1000);

  await GmailAccount.findOneAndUpdate(
    { userId, gmailEmail },
    {
      userId,
      gmailEmail,
      encryptedAccessToken: encrypt(tokens.access_token),
      encryptedRefreshToken: encrypt(tokens.refresh_token),
      tokenExpiresAt,
      connected: true,
      lastError: null,
    },
    { upsert: true, new: true }
  );

  return { gmailEmail };
}

export type GmailSendOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  apiKeyId?: string | mongoose.Types.ObjectId;
  attachments?: {
    filename: string;
    content: string; // Base64
    type?: string;
  }[];
};

export async function sendGmailEmail(
  userId: string,
  options: GmailSendOptions
): Promise<{ messageId: string | null }> {
  await connectDB();

  let lookupEmail = options.from;
  if (lookupEmail && lookupEmail.includes("<")) {
    const match = lookupEmail.match(/<([^>]+)>/);
    if (match) {
      lookupEmail = match[1].trim();
    }
  }

  let account;
  if (lookupEmail) {
    account = await GmailAccount.findOne({ userId, gmailEmail: lookupEmail });
    if (!account) {
      throw new Error(`Gmail account '${lookupEmail}' is not connected. Please go to your SendLiberty dashboard, connect this Gmail account, and try again.`);
    }
  } else {
    account = await GmailAccount.findOne({ userId });
    if (!account) {
      throw new Error("No Gmail account connected. Please go to your SendLiberty dashboard, connect a Gmail account, and try again.");
    }
  }
  if (!account.connected) throw new Error(`Gmail account '${account.gmailEmail}' is disconnected. Please reconnect.`);

  const senderEmail = account.gmailEmail;
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const sentCount = await EmailLog.countDocuments({
    from: senderEmail,
    status: "sent",
    createdAt: { $gte: startOfToday }
  });

  const isWorkspace = !senderEmail.endsWith("@gmail.com") && !senderEmail.endsWith("@googlemail.com");
  const limit = isWorkspace ? 2000 : 500;

  if (sentCount >= limit) {
    throw new Error(`Daily limit reached: Connected Gmail '${senderEmail}' has already sent ${sentCount} of its ${limit} daily allowed emails today.`);
  }

  const bufferMs = 5 * 60 * 1000;
  let accessToken = decrypt(account.encryptedAccessToken);

  if (account.tokenExpiresAt.getTime() - bufferMs <= Date.now()) {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: decrypt(account.encryptedRefreshToken) });
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      if (!credentials.access_token) throw new Error("Refresh returned no access token");
      account.encryptedAccessToken = encrypt(credentials.access_token);
      account.tokenExpiresAt = credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : new Date(Date.now() + 3600 * 1000);
      await account.save();
      accessToken = credentials.access_token;
    } catch (err) {
      account.connected = false;
      account.lastError = String(err);
      await account.save();
      throw new Error("Gmail token refresh failed. Please reconnect your Gmail account.");
    }
  }

  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const toAddress = Array.isArray(options.to) ? options.to.join(", ") : options.to;
  const ccAddress = options.cc
    ? Array.isArray(options.cc)
      ? options.cc.join(", ")
      : options.cc
    : undefined;
  const bccAddress = options.bcc
    ? Array.isArray(options.bcc)
      ? options.bcc.join(", ")
      : options.bcc
    : undefined;

  const mailOptions = {
    from: options.from ?? senderEmail,
    to: toAddress,
    cc: ccAddress,
    bcc: bccAddress,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments?.map((att) => ({
      filename: att.filename,
      content: Buffer.from(att.content, "base64"),
      contentType: att.type,
    })),
  };

  const mail = new MailComposer(mailOptions);
  const messageBuffer = await mail.compile().build();
  const encodedMessage = messageBuffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    await EmailLog.create({
      userId,
      apiKeyId: options.apiKeyId,
      from: senderEmail,
      to: toAddress,
      subject: options.subject,
      status: "sent",
      provider: "gmail",
      messageId: result.data.id ?? null,
    });

    return { messageId: result.data.id ?? null };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    await EmailLog.create({
      userId,
      apiKeyId: options.apiKeyId,
      from: senderEmail,
      to: toAddress,
      subject: options.subject,
      status: "failed",
      provider: "gmail",
      error: errMsg,
    });
    throw new Error(`Failed to send email via Gmail: ${errMsg}`);
  }
}
