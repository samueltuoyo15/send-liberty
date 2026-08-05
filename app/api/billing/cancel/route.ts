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
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Cancellation call failed";
        console.warn("Bachs cancellation warning:", msg);
      }
    }

    user.set("subscriptionStatus", "canceled");
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Your subscription has been canceled.",
    });
  } catch (err) {
    if (err instanceof Response) return err;
    const msg = err instanceof Error ? err.message : "Failed to cancel subscription";
    console.error("Cancel API error:", msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
