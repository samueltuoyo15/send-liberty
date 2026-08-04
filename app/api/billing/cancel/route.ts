import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cancelBachsSubscription } from "@/lib/bachs";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuthUser(req);
    await connectDB();

    const user = await User.findById(new mongoose.Types.ObjectId(authUser.id));
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.subscriptionId) {
      try {
        await cancelBachsSubscription(user.subscriptionId);
      } catch (err: any) {
        console.warn("[Cancel Subscription Warning]:", err?.response?.data || err.message);
      }
    }

    user.set("subscriptionStatus", "canceled");
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Your subscription has been canceled.",
    });
  } catch (err: any) {
    if (err instanceof Response) return err;
    console.error("/api/billing/cancel POST error:", err);
    return NextResponse.json({ success: false, message: "Failed to cancel subscription" }, { status: 500 });
  }
}
