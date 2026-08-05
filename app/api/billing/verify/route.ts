import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getBachsCheckoutSession } from "@/lib/bachs";
import mongoose from "mongoose";

interface WebhookData {
  id?: string;
  subscription_id?: string;
  subscription?: string | { id?: string; subscription_id?: string };
}

function extractSubscriptionId(data: WebhookData | undefined): string | undefined {
  if (!data) return undefined;
  if (typeof data.subscription_id === "string") return data.subscription_id;
  if (typeof data.subscription === "string") return data.subscription;
  if (typeof data.subscription === "object" && data.subscription) {
    if (typeof data.subscription.subscription_id === "string") return data.subscription.subscription_id;
    if (typeof data.subscription.id === "string") return data.subscription.id;
  }
  if (typeof data.id === "string" && data.id.startsWith("sub_")) return data.id;
  return undefined;
}

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
        if (session && (session.status === "COMPLETED" || session.status === "completed" || session.status === "OPEN" || session.status === "open")) {
          user.set("plan", "pro");
          user.set("subscriptionStatus", "active");
          user.set("lastPaymentAt", new Date());

          const subId = extractSubscriptionId(session as WebhookData);
          if (subId) {
            user.set("subscriptionId", subId);
          }

          await user.save();
          return NextResponse.json({ success: true, plan: "pro", verified: true });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Manual verification failed";
        console.warn("Manual verification warning:", msg);
      }
    }

    return NextResponse.json({
      success: true,
      plan: user.plan || "free",
      verified: user.plan === "pro",
    });
  } catch (err) {
    if (err instanceof Response) return err;
    const msg = err instanceof Error ? err.message : "Verification error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
