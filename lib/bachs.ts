import axios from "axios";
import crypto from "crypto";

export interface CreateCheckoutSessionOptions {
  customerEmail: string;
  customerName?: string;
  productId?: string;
  amount?: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createBachsCheckoutSession(options: CreateCheckoutSessionOptions) {
  const secretKey = (process.env.BACHS_SECRET_KEY || "").trim();
  if (!secretKey) {
    throw new Error("BACHS_SECRET_KEY is missing from environment variables.");
  }

  const isSandbox = secretKey.startsWith("sk_sandbox_") || process.env.BACHS_ENV !== "production";
  const baseUrl = isSandbox ? "https://sandbox-api.bachs.io" : "https://api.bachs.io";

  const { customerEmail, customerName, productId, amount, currency = "USD", successUrl, cancelUrl, metadata } = options;

  const payload: Record<string, any> = {
    customer: {
      email: customerEmail,
      name: customerName || customerEmail.split("@")[0],
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  };

  if (productId) {
    payload.product_cart = [{ product_id: productId }];
  } else if (amount) {
    payload.pricing = {
      amount: amount,
      currency: currency.toUpperCase(),
    };
  }

  const response = await axios.post(`${baseUrl}/v1/checkout-sessions`, payload, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function getBachsCheckoutSession(checkoutId: string) {
  const secretKey = (process.env.BACHS_SECRET_KEY || "").trim();
  if (!secretKey) {
    throw new Error("BACHS_SECRET_KEY is missing from environment variables.");
  }

  const isSandbox = secretKey.startsWith("sk_sandbox_") || process.env.BACHS_ENV !== "production";
  const baseUrl = isSandbox ? "https://sandbox-api.bachs.io" : "https://api.bachs.io";

  const response = await axios.get(`${baseUrl}/v1/checkout-sessions/${checkoutId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function cancelBachsSubscription(subscriptionId: string) {
  const secretKey = (process.env.BACHS_SECRET_KEY || "").trim();
  if (!secretKey) {
    throw new Error("BACHS_SECRET_KEY is missing from environment variables.");
  }

  const isSandbox = secretKey.startsWith("sk_sandbox_") || process.env.BACHS_ENV !== "production";
  const baseUrl = isSandbox ? "https://sandbox-api.bachs.io" : "https://api.bachs.io";

  const response = await axios.delete(`${baseUrl}/v1/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    data: {
      cancel_at_period_end: true,
      reason: "User requested cancellation via SendLib dashboard",
    },
  });

  return response.data;
}

export function verifyBachsSignature(
  rawBody: string,
  secret: string,
  timestampHeader: string,
  signatureHeader: string,
  toleranceSeconds = 300
): boolean {
  try {
    const timestamp = parseInt(timestampHeader, 10);
    if (isNaN(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) {
      return false;
    }

    let cleanSig = signatureHeader.trim();
    if (cleanSig.startsWith("v1=")) {
      cleanSig = cleanSig.substring(3);
    }

    const message = `${timestamp}.${rawBody}`;
    const expected = crypto
      .createHmac("sha256", secret.trim())
      .update(message, "utf8")
      .digest("hex");

    if (expected.length !== cleanSig.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(cleanSig, "utf8")
    );
  } catch (err) {
    console.error("Signature verification exception:", err);
    return false;
  }
}
