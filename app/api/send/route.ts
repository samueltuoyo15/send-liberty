import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendGmailEmail } from "@/lib/gmail";
import ApiKey, { IApiKey } from "@/models/ApiKey";
import User from "@/models/User";
import argon2 from "argon2";
import mongoose from "mongoose";
import { rateLimit } from "@/lib/rateLimit";

const MAX_SUBJECT_LENGTH = 998;
const MAX_RECIPIENTS = 50;
const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;

const PLAN_LIMITS = {
  free: {
    maxHtmlBytes: 2 * 1024 * 1024,
    maxTextBytes: 1 * 1024 * 1024,
    maxAttachments: 5,
    maxAttachmentBytes: 1 * 1024 * 1024,
  },
  pro: {
    maxHtmlBytes: 5 * 1024 * 1024,
    maxTextBytes: 2 * 1024 * 1024,
    maxAttachments: 20,
    maxAttachmentBytes: 10 * 1024 * 1024,
  },
};

function isOriginAllowed(origin: string | null, allowed: string[]): boolean {
  if (!allowed || allowed.length === 0) return true;
  if (!origin) return false;

  let cleanOrigin = origin.toLowerCase().trim();
  cleanOrigin = cleanOrigin.replace(/^(https?:\/\/)/, "").split("/")[0];

  for (const pattern of allowed) {
    const cleanPattern = pattern.replace(/^(https?:\/\/)/, "").split("/")[0];
    if (cleanPattern === cleanOrigin) return true;
  }
  return false;
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const rawKey =
      req.headers.get("x-api-key") ??
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!rawKey) {
      return NextResponse.json(
        { success: false, message: "API key required. Pass it in the x-api-key header or as a Bearer token in the Authorization header." },
        { status: 401 }
      );
    }

    await connectDB();

    const parts = rawKey.split("_");
    if (parts.length < 3) {
      return NextResponse.json({ success: false, message: "Invalid API key format." }, { status: 401 });
    }
    const prefix = `${parts[0]}_${parts[1]}`;

    const candidates = await ApiKey.find({ keyPrefix: prefix, revoked: false });
    let authenticatedUserId: string | null = null;
    let apiKeyId: mongoose.Types.ObjectId | null = null;
    let matchedKey: IApiKey | null = null;

    for (const candidate of candidates) {
      const valid = await argon2.verify(candidate.keyHash, rawKey);
      if (valid) {
        authenticatedUserId = candidate.userId.toString();
        apiKeyId = candidate._id as mongoose.Types.ObjectId;
        matchedKey = candidate;
        candidate.lastUsedAt = new Date();
        await candidate.save();
        break;
      }
    }

    if (!authenticatedUserId || !matchedKey) {
      return NextResponse.json({ success: false, message: "Invalid or revoked API key." }, { status: 401 });
    }

    const user = await User.findById(authenticatedUserId).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User account not found." }, { status: 404 });
    }

    // --- Rate limit ---
    const plan = user.plan || "free";
    const rl = await rateLimit("send", apiKeyId!.toString(), plan);
    const limit = plan === "pro" ? 300 : 30;
    
    if (!rl.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Rate limit exceeded. You can send up to ${limit} requests/minute per API key. Try again in ${rl.resetInSeconds} second${rl.resetInSeconds === 1 ? "" : "s"}.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "Retry-After": String(rl.resetInSeconds),
          },
        }
      );
    }

    // --- Origin restriction ---
    if (matchedKey.allowedOrigins && matchedKey.allowedOrigins.length > 0) {
      const origin = req.headers.get("origin");
      const referer = req.headers.get("referer");
      const clientOrigin = origin || referer || null;

      if (!isOriginAllowed(clientOrigin, matchedKey.allowedOrigins)) {
        return NextResponse.json(
          {
            success: false,
            message: `Origin not allowed: '${clientOrigin || "unknown"}' is not in this API key's allowed origins list. Update it in your SendLib dashboard under API Keys.`,
          },
          { status: 403 }
        );
      }
    }


    const body = await req.json();
    const {
      to: rawTo,
      subject,
      html,
      text,
      replyTo,
      cc: rawCc,
      bcc: rawBcc,
      from,
      attachments,
    } = body as {
      to?: unknown;
      subject?: unknown;
      html?: string;
      text?: string;
      replyTo?: string;
      cc?: string | string[];
      bcc?: string | string[];
      from?: string;
      attachments?: { filename: string; content: string; type?: string }[];
    };

    // --- Required fields ---
    if (!rawTo || !subject) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: to, subject." },
        { status: 400 }
      );
    }
    if (!html && !text) {
      return NextResponse.json(
        { success: false, message: "Either html or text body is required." },
        { status: 400 }
      );
    }

    const subjectStr = String(subject);

    // --- Subject length ---
    if (subjectStr.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json(
        { success: false, message: `Subject too long. Max ${MAX_SUBJECT_LENGTH} characters (RFC 2822 limit).` },
        { status: 413 }
      );
    }

    // --- Plan-based limits ---
    const planLimits = plan === "pro" ? PLAN_LIMITS.pro : PLAN_LIMITS.free;

    // --- Body size ---
    if (html && Buffer.byteLength(html, "utf8") > planLimits.maxHtmlBytes) {
      const maxMb = plan === "pro" ? "5MB" : "2MB";
      return NextResponse.json(
        { success: false, message: `HTML body too large. Your ${plan} plan allows up to ${maxMb}.` },
        { status: 413 }
      );
    }
    if (text && Buffer.byteLength(text, "utf8") > planLimits.maxTextBytes) {
      const maxMb = plan === "pro" ? "2MB" : "1MB";
      return NextResponse.json(
        { success: false, message: `Text body too large. Your ${plan} plan allows up to ${maxMb}.` },
        { status: 413 }
      );
    }

    // --- Recipient counts ---
    const toArr = toArray(rawTo);
    const ccArr = toArray(rawCc);
    const bccArr = toArray(rawBcc);

    if (toArr.length === 0) {
      return NextResponse.json({ success: false, message: "At least one 'to' recipient is required." }, { status: 400 });
    }
    if (toArr.length > MAX_RECIPIENTS) {
      return NextResponse.json(
        { success: false, message: `Too many 'to' recipients. Max ${MAX_RECIPIENTS} per request.` },
        { status: 400 }
      );
    }
    if (ccArr.length > MAX_RECIPIENTS) {
      return NextResponse.json(
        { success: false, message: `Too many 'cc' recipients. Max ${MAX_RECIPIENTS} per request.` },
        { status: 400 }
      );
    }
    if (bccArr.length > MAX_RECIPIENTS) {
      return NextResponse.json(
        { success: false, message: `Too many 'bcc' recipients. Max ${MAX_RECIPIENTS} per request.` },
        { status: 400 }
      );
    }

    // --- Attachments ---
    if (attachments) {
      if (attachments.length > planLimits.maxAttachments) {
        return NextResponse.json(
          { success: false, message: `Too many attachments. Your ${plan} plan allows up to ${planLimits.maxAttachments} files per request.` },
          { status: 400 }
        );
      }
      let totalBytes = 0;
      for (const att of attachments) {
        if (!att.filename || !att.content) {
          return NextResponse.json(
            { success: false, message: "Each attachment requires a filename and a base64-encoded content string." },
            { status: 400 }
          );
        }
        const bytes = Buffer.byteLength(att.content, "base64");
        if (bytes > planLimits.maxAttachmentBytes) {
          const maxMb = plan === "pro" ? "10MB" : "1MB";
          return NextResponse.json(
            { success: false, message: `Attachment '${att.filename}' is too large. Your ${plan} plan allows up to ${maxMb} per file.` },
            { status: 413 }
          );
        }
        totalBytes += bytes;
      }
      if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
        return NextResponse.json(
          { success: false, message: "Total attachment size exceeds the 25MB limit (enforced by Gmail API)." },
          { status: 413 }
        );
      }
    }

    const retentionDays = plan === "pro" ? 90 : 5;
    const result = await sendGmailEmail(authenticatedUserId, {
      to: toArr.length === 1 ? toArr[0] : toArr,
      subject: subjectStr,
      html,
      text,
      replyTo,
      cc: ccArr.length > 0 ? ccArr : undefined,
      bcc: bccArr.length > 0 ? bccArr : undefined,
      from,
      attachments,
      apiKeyId: apiKeyId || undefined,
      retentionDays,
    });

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Failed to send email";
    console.error("/api/send error:", err);

    let status = 400;
    const lower = errMsg.toLowerCase();
    if (lower.includes("limit reached")) {
      status = 429;
    } else if (
      lower.includes("disconnected") ||
      lower.includes("refresh failed") ||
      lower.includes("permission") ||
      lower.includes("scope") ||
      lower.includes("reconnect") ||
      lower.includes("unauthorized")
    ) {
      status = 403;
    }

    return NextResponse.json({ success: false, message: errMsg }, { status });
  }
}
