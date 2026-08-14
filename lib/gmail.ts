// googleapis removed — all Google API calls use axios directly
import axios from "@/lib/axios";
import { encrypt, decrypt } from "./encryption";
import { connectDB } from "./db";
import GmailAccount from "@/models/GmailAccount";
import EmailLog from "@/models/EmailLog";
import User from "@/models/User";
import MailComposer from "nodemailer/lib/mail-composer";
import mongoose from "mongoose";
import crypto from "crypto";
import dns from "dns";

// Fix for Zeabur DNS resolution issue (IPv4 only)
dns.setDefaultResultOrder("ipv4first");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GMAIL_CALLBACK_URL, JWT_SECRET } = process.env;

export function buildGoogleAuthUrl(params: Record<string, string>): string {
  const base = "https://accounts.google.com/o/oauth2/v2/auth";
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
}

export function signGmailState(userId: string): string {
  const nonce = crypto.randomBytes(12).toString("hex");
  const timestamp = Date.now();
  const payload = `${userId}:${nonce}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", JWT_SECRET!).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

export function verifyGmailState(state: string): string {
  let decoded: string;
  try {
    decoded = Buffer.from(state, "base64url").toString("utf8");
  } catch {
    throw new Error("Invalid state parameter");
  }
  const parts = decoded.split(":");
  if (parts.length < 4) throw new Error("Invalid state format");

  const hmac = parts[parts.length - 1];
  const payload = parts.slice(0, -1).join(":");
  const timestamp = parseInt(parts[parts.length - 2], 10);
  const userId = parts[0];

  const expected = crypto.createHmac("sha256", JWT_SECRET!).update(payload).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"))) {
      throw new Error("State signature mismatch — possible CSRF attempt");
    }
  } catch {
    throw new Error("State signature mismatch — possible CSRF attempt");
  }

  if (Date.now() - timestamp > 10 * 60 * 1000) {
    throw new Error("OAuth state has expired. Please try connecting your Gmail account again.");
  }

  return userId;
}

export function getGmailAuthUrl(userId: string): string {
  return buildGoogleAuthUrl({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: GMAIL_CALLBACK_URL!,
    response_type: "code",
    access_type: "offline",
    prompt: "consent select_account",
    scope: "https://www.googleapis.com/auth/gmail.send email",
    state: signGmailState(userId),
  });
}

export async function handleGmailCallback(code: string, userId: string) {
  await connectDB();

  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: GMAIL_CALLBACK_URL!,
      grant_type: "authorization_code",
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const tokens = tokenRes.data;
  if (!tokens.access_token) throw new Error("Failed to get access token from Google");

  const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const gmailEmail = userInfoRes.data.email;
  if (!gmailEmail) throw new Error("Failed to get Gmail email from Google");

  const tokenExpiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : new Date(Date.now() + 3600 * 1000);

  const existingAccount = await GmailAccount.findOne({ userId, gmailEmail });
  const isNew = !existingAccount;

  const encryptedRefreshToken = tokens.refresh_token
    ? encrypt(tokens.refresh_token)
    : existingAccount?.encryptedRefreshToken;

  if (!encryptedRefreshToken) {
    throw new Error(
      "No refresh token received from Google. Please revoke app access in your Google Account Security settings and try again."
    );
  }

  await GmailAccount.findOneAndUpdate(
    { userId, gmailEmail },
    {
      userId,
      gmailEmail,
      encryptedAccessToken: encrypt(tokens.access_token),
      encryptedRefreshToken,
      tokenExpiresAt,
      connected: true,
      lastError: null,
    },
    { upsert: true, new: true }
  );

  return { gmailEmail, isNew };
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
  retentionDays?: number;
  plan?: "free" | "pro";
  attachments?: {
    filename: string;
    content: string;
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
  if (!lookupEmail) {
    throw new Error("The 'from' field is required.");
  }
  
  account = await GmailAccount.findOne({ userId, gmailEmail: lookupEmail });
  if (!account) {
    throw new Error(`Gmail account '${lookupEmail}' is not connected. Please go to your Sendlib dashboard, connect this Gmail account, and try again.`);
  }
  if (!account.connected) throw new Error(`Gmail account '${account.gmailEmail}' is disconnected. Please reconnect.`);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const isPro = options.plan === "pro";

  // Check and reset monthly quota if reset date has passed
  const now = new Date();
  if (user.monthlyLimitResetAt && now >= user.monthlyLimitResetAt) {
    let nextReset = new Date(user.monthlyLimitResetAt);
    nextReset.setMonth(nextReset.getMonth() + 1);
    while (nextReset <= now) {
      nextReset.setMonth(nextReset.getMonth() + 1);
    }
    user.monthlySentCount = 0;
    user.monthlyLimitResetAt = nextReset;
    await user.save();
  } else if (!user.monthlyLimitResetAt) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    user.monthlyLimitResetAt = nextReset;
    user.monthlySentCount = 0;
    await user.save();
  }

  if (!isPro && (user.monthlySentCount || 0) >= 3500) {
    throw new Error("Monthly limit reached: You have already sent 3,500 emails this month (limit for the Free plan). Please upgrade to Pro to unlock unlimited monthly sending.");
  }

  const senderEmail = account.gmailEmail;
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const sentCount = await EmailLog.countDocuments({
    userId: account.userId,
    from: senderEmail,
    status: "sent",
    createdAt: { $gte: startOfToday }
  });

  const isWorkspace = !senderEmail.endsWith("@gmail.com") && !senderEmail.endsWith("@googlemail.com");
  const limit = isWorkspace
    ? isPro ? 2000 : 1000
    : isPro ? 500 : 200;

  if (sentCount >= limit) {
    throw new Error(`Daily limit reached: Connected Gmail '${senderEmail}' has already sent ${sentCount} of its ${limit} daily allowed emails today.${!isPro ? " Upgrade to Pro to unlock higher daily sending limits." : ""}`);
  }

  const bufferMs = 5 * 60 * 1000;
  let accessToken = decrypt(account.encryptedAccessToken);

  if (account.tokenExpiresAt.getTime() - bufferMs <= Date.now()) {
    try {
      const refreshRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          refresh_token: decrypt(account.encryptedRefreshToken),
          grant_type: "refresh_token",
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const refreshed = refreshRes.data;
      if (!refreshed.access_token) throw new Error("Refresh returned no access token");
      account.encryptedAccessToken = encrypt(refreshed.access_token);
      account.tokenExpiresAt = refreshed.expires_in
        ? new Date(Date.now() + refreshed.expires_in * 1000)
        : new Date(Date.now() + 3600 * 1000);
      await account.save();
      accessToken = refreshed.access_token;
    } catch (err) {
      account.connected = false;
      account.lastError = String(err);
      await account.save();
      throw new Error("Gmail token refresh failed. Please reconnect your Gmail account.");
    }
  }

  // Using direct axios instead of googleapis to avoid native fetch IPv4 DNS issues on Zeabur

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
    const result = await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      { raw: encodedMessage },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options.retentionDays ?? 5));

    await EmailLog.create({
      userId,
      apiKeyId: options.apiKeyId,
      from: senderEmail,
      to: toAddress,
      subject: options.subject,
      status: "sent",
      provider: "gmail",
      messageId: result.data.id ?? null,
      expiresAt,
    });

    await User.findByIdAndUpdate(userId, { $inc: { monthlySentCount: 1 } });

    return { messageId: result.data.id ?? null };
  } catch (err: unknown) {
    let errMsg = "Unknown error";
    if (axios.isAxiosError(err)) {
      errMsg = err.response?.data?.error?.message || err.message;
    } else if (err instanceof Error) {
      errMsg = err.message;
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options.retentionDays ?? 5));
    await EmailLog.create({
      userId,
      apiKeyId: options.apiKeyId,
      from: senderEmail,
      to: toAddress,
      subject: options.subject,
      status: "failed",
      provider: "gmail",
      error: errMsg,
      expiresAt,
    });
    throw new Error(`Failed to send email via Gmail: ${errMsg}`);
  }
}
