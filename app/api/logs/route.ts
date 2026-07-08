import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import EmailLog from "@/models/EmailLog";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    await connectDB();

    const [logs, total] = await Promise.all([
      EmailLog.find({ userId: new mongoose.Types.ObjectId(user.id) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("to subject status provider messageId error createdAt")
        .lean(),
      EmailLog.countDocuments({ userId: new mongoose.Types.ObjectId(user.id) }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/logs GET error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
