import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const payload = await getAuthUser(req);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.id).select("-__v").lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        lastPaymentAt: user.lastPaymentAt,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
