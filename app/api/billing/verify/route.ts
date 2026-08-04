import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getBachsCheckoutSession } from "@/lib/bachs";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const authUser = await requireAuthUser(req);
    const { searchParams } = new URL(req.url);
    const checkoutId = searchParams.get("checkout_id");

    await connectDB();
    const user = await User.findById(new mongoose.Types.ObjectId(authUser.id));

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (checkoutId) {
      try {
        const session = await getBachsCheckoutSession(checkoutId);
        if (session && (session.status === "COMPLETED" || session.status === "completed")) {
          user.set("plan", "pro");
          user.set("subscriptionStatus", "active");
          user.set("lastPaymentAt", new Date());
          if (session.subscription_id || session.id) {
            user.set("subscriptionId", session.subscription_id || session.id);
          }
          await user.save();
          return NextResponse.json({ success: true, plan: "pro", verified: true });
        }
      } catch (err: any) {
        console.warn("[Manual Verification Warning]:", err?.response?.data || err.message);
      }
    }

    return NextResponse.json({
      success: true,
      plan: user.plan || "free",
      verified: user.plan === "pro",
    });
  } catch (err: any) {
    if (err instanceof Response) return err;
    console.error("/api/billing/verify GET error:", err);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}
