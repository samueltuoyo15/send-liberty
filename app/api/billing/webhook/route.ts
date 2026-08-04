import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyBachsSignature } from "@/lib/bachs";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-bachs-signature");
    const timestamp = req.headers.get("x-bachs-timestamp");
    const webhookSecret = process.env.BACHS_WEBHOOK_SECRET?.trim();

    if (webhookSecret && signature && timestamp) {
      const isValid = verifyBachsSignature(rawBody, webhookSecret, timestamp, signature);
      if (!isValid) {
        console.warn("[Bachs Webhook] Invalid signature rejected.");
        return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const eventType = payload.type || payload.event || payload.status;
    const data = payload.data || payload;
    const metadata = data.metadata || {};
    const userId = metadata.userId;

    console.log(`[Bachs Webhook Received] event: ${eventType}, userId: ${userId || "none"}`);

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      await connectDB();
      const user = await User.findById(new mongoose.Types.ObjectId(userId));

      if (user) {
        const activeEvents = [
          "checkout.completed",
          "collection.succeeded",
          "customer.subscription.created",
          "customer.subscription.updated",
          "COMPLETED",
        ];

        const inactiveEvents = [
          "customer.subscription.deleted",
          "customer.subscription.canceled",
          "collection.failed",
          "invoice.payment_failed",
          "checkout.expired",
          "EXPIRED",
          "CANCELLED",
        ];

        if (activeEvents.includes(eventType)) {
          user.set("plan", "pro");
          user.set("subscriptionStatus", "active");
          user.set("lastPaymentAt", new Date());
          if (data.subscription_id || data.subscription || data.id) {
            user.set("subscriptionId", data.subscription_id || data.subscription || data.id);
          }
          await user.save();
          console.log(`[Bachs Webhook] User ${userId} successfully upgraded to Pro.`);
        } else if (inactiveEvents.includes(eventType)) {
          user.set("plan", "free");
          user.set("subscriptionStatus", eventType.includes("failed") ? "past_due" : "canceled");
          await user.save();
          console.log(`[Bachs Webhook] User ${userId} downgraded/canceled.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Bachs Webhook Fatal Error]:", err?.stack || err);
    return NextResponse.json({ success: false, message: err?.message || "Webhook processing error" }, { status: 500 });
  }
}
