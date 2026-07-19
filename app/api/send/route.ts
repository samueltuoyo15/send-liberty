import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { sendGmailEmail } from "@/lib/gmail";
import ApiKey from "@/models/ApiKey";
import User from "@/models/User";
import argon2 from "argon2";
import mongoose from "mongoose";

function isOriginAllowed(origin: string | null, allowed: string[]): boolean {
  if (!allowed || allowed.length === 0) return true;
  if (!origin) return false;

  // Clean origin (remove protocol and trailing slash/path)
  let cleanOrigin = origin.toLowerCase().trim();
  cleanOrigin = cleanOrigin.replace(/^(https?:\/\/)/, "").split("/")[0];

  for (const pattern of allowed) {
    let cleanPattern = pattern.replace(/^(https?:\/\/)/, "").split("/")[0];

    if (cleanPattern === cleanOrigin) {
      return true;
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawKey =
      req.headers.get("x-api-key") ??
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!rawKey) {
      return NextResponse.json(
        { success: false, message: "API key required. Pass it in the x-api-key header or Bearer Token Authorization." },
        { status: 401 }
      );
    }

    await connectDB();

    const parts = rawKey.split("_");
    if (parts.length < 3) {
      return NextResponse.json({ success: false, message: "Invalid API key format" }, { status: 401 });
    }
    const prefix = `${parts[0]}_${parts[1]}`;

    const candidates = await ApiKey.find({ keyPrefix: prefix, revoked: false });
    let authenticatedUserId: string | null = null;
    let apiKeyId: mongoose.Types.ObjectId | null = null;
    let matchedKey: any = null;

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
      return NextResponse.json({ success: false, message: "Invalid or revoked API key" }, { status: 401 });
    }

    // Validate origin / referer if restricted
    if (matchedKey.allowedOrigins && matchedKey.allowedOrigins.length > 0) {
      const origin = req.headers.get("origin");
      const referer = req.headers.get("referer");
      const clientOrigin = origin || referer || null;

      if (!isOriginAllowed(clientOrigin, matchedKey.allowedOrigins)) {
        return NextResponse.json(
          {
            success: false,
            message: `Origin restricted: The requesting origin '${clientOrigin || "unknown"}' is not allowed for this API Key. Go to your SendLib dashboard and add it to your API Key allowed origins, or remove origin restrictions.`,
          },
          { status: 403 }
        );
      }
    }

    const user = await User.findById(authenticatedUserId).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { to, subject, html, text, replyTo, cc, bcc, from, attachments } = body as {
      to?: unknown;
      subject?: unknown;
      html?: string;
      text?: string;
      replyTo?: string;
      cc?: string | string[];
      bcc?: string | string[];
      from?: string;
      attachments?: {
        filename: string;
        content: string; // Base64
        type?: string;
      }[];
    };

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }
    if (!html && !text) {
      return NextResponse.json(
        { success: false, message: "Either html or text body is required" },
        { status: 400 }
      );
    }

    const result = await sendGmailEmail(authenticatedUserId, {
      to: to as string | string[],
      subject: subject as string,
      html,
      text,
      replyTo,
      cc,
      bcc,
      from,
      attachments,
      apiKeyId: apiKeyId || undefined,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    console.error("/api/send error:", err);
    return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
  }
}
