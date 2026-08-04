import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ApiKey from "@/models/ApiKey";
import GmailAccount from "@/models/GmailAccount";
import User from "@/models/User";
import argon2 from "argon2";
import crypto from "crypto";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();

    const keys = await ApiKey.find({ userId: new mongoose.Types.ObjectId(user.id) })
      .select("name keyPrefix revoked allowedOrigins lastUsedAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedKeys = keys.map((key: any) => ({
      id: key._id.toString(),
      name: key.name,
      keyPrefix: key.keyPrefix,
      revoked: key.revoked,
      allowedOrigins: key.allowedOrigins,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
    }));

    return NextResponse.json({ success: true, data: formattedKeys });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/keys GET error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const MAX_KEYS_PER_USER = 15;

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();
    const dbUser = await User.findById(user.id).lean();

    // Verify user has at least one connected Gmail account
    const connectedAccountCount = await GmailAccount.countDocuments({
      userId: new mongoose.Types.ObjectId(user.id),
      connected: true,
    });

    if (connectedAccountCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You must connect at least one Gmail account before creating an API key. Go to Dashboard → Accounts to connect a Gmail account.",
        },
        { status: 400 }
      );
    }

    // Enforce per-user key limit for Free tier
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((dbUser as any)?.plan !== "pro") {
      const activeKeyCount = await ApiKey.countDocuments({
        userId: new mongoose.Types.ObjectId(user.id),
        revoked: false,
      });
      if (activeKeyCount >= MAX_KEYS_PER_USER) {
        return NextResponse.json(
          {
            success: false,
            message: `You have reached the maximum of ${MAX_KEYS_PER_USER} active API keys on the Free plan. Please revoke an existing key before creating a new one.`,
          },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const rawName = String(body.name ?? "").trim();
    const name: string = rawName.length > 0 ? rawName.slice(0, 25) : "My API Key";
    const rawAllowedOrigins = Array.isArray(body.allowedOrigins) ? body.allowedOrigins : [];
    const allowedOrigins = rawAllowedOrigins
      .map((o: unknown) => String(o).trim().toLowerCase())
      .filter((o: string) => o.length > 0 && o.length <= 253);

    const rawKey = crypto.randomBytes(32).toString("hex");
    const prefix = `sl_${rawKey.substring(0, 8)}`;
    const fullKey = `${prefix}_${rawKey.substring(8)}`;
    const keyHash = await argon2.hash(fullKey);

    const apiKey = await ApiKey.create({
      userId: new mongoose.Types.ObjectId(user.id),
      name,
      keyHash,
      keyPrefix: prefix,
      allowedOrigins,
    });

    return NextResponse.json(
      {
        success: true,
        message: "API key created. Save it now — it won't be shown again.",
        data: {
          id: apiKey._id,
          key: fullKey,
          prefix: apiKey.keyPrefix,
          name: apiKey.name,
          allowedOrigins: apiKey.allowedOrigins,
          createdAt: apiKey.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/keys POST error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
