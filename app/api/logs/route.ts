import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import EmailLog, { IEmailLog } from "@/models/EmailLog";
import mongoose, { FilterQuery } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const from = searchParams.get("from")?.trim() ?? "";

    await connectDB();

    const query: FilterQuery<IEmailLog> = { userId: new mongoose.Types.ObjectId(user.id) };

    if (status) {
      query.status = status;
    }
    if (from) {
      query.from = from;
    }
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { to: { $regex: escapedSearch, $options: "i" } },
        { subject: { $regex: escapedSearch, $options: "i" } },
        { from: { $regex: escapedSearch, $options: "i" } }
      ];
    }

    const [logs, total] = await Promise.all([
      EmailLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("from to subject status provider messageId error apiKeyId createdAt")
        .lean(),
      EmailLog.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("GET api/logs error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
