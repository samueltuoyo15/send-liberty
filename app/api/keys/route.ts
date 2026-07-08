import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ApiKey from "@/models/ApiKey";
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

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();

    const body = await req.json();
    const name: string = body.name || "My API Key";
    const rawAllowedOrigins = Array.isArray(body.allowedOrigins) ? body.allowedOrigins : [];
    const allowedOrigins = rawAllowedOrigins
      .map((o: any) => String(o).trim().toLowerCase())
      .filter((o: string) => o.length > 0);

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
