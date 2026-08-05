import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyBachsSignature } from "@/lib/bachs";
import mongoose from "mongoose";

interface WebhookData {
  id?: string;
  subscription_id?: string;
  subscription?: string | { id?: string; subscription_id?: string };
  metadata?: Record<string, string>;
}

interface WebhookPayload {
  type?: string;
  event?: string;
  status?: string;
  data?: WebhookData;
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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-bachs-signature");
    const timestamp = req.headers.get("x-bachs-timestamp");
    const webhookSecret = process.env.BACHS_WEBHOOK_SECRET?.trim();

    if (!webhookSecret) {
      console.warn("Bachs webhook secret not set. Skipping signature verification.");
    } else if (!signature || !timestamp) {
      console.warn("Bachs webhook missing signature or timestamp headers.");
      return NextResponse.json({ success: false, message: "Missing signature headers" }, { status: 401 });
    } else {
      const isValid = verifyBachsSignature(rawBody, webhookSecret, timestamp, signature);
      if (!isValid) {
        console.warn("Bachs webhook invalid signature.");
        return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
      }
    }

    let payload: WebhookPayload = {};
    try {
      payload = JSON.parse(rawBody) as WebhookPayload;
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const eventType = payload.type || payload.event || payload.status;
    const data = payload.data || (payload as unknown as WebhookData);
    const metadata = data.metadata || {};
    const userId = metadata.userId;

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

        if (eventType && activeEvents.includes(eventType)) {
          user.set("plan", "pro");
          user.set("subscriptionStatus", "active");
          user.set("lastPaymentAt", new Date());

          const subId = extractSubscriptionId(data);
          if (subId) {
            user.set("subscriptionId", subId);
          }

          await user.save();
        } else if (eventType && inactiveEvents.includes(eventType)) {
          user.set("plan", "free");
          user.set("subscriptionStatus", eventType.includes("failed") ? "past_due" : "canceled");
          await user.save();
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing error";
    console.error("Bachs webhook error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
