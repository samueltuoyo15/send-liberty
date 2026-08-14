import axios from "@/lib/axios";
import crypto from "crypto";

export interface CurrencyOption {
  currency: string;
  amount: string;
}

export interface CreateCheckoutSessionOptions {
  customerEmail: string;
  customerName?: string;
  productId?: string;
  amount?: number | string;
  currency?: string;
  /** Per-currency exact prices (e.g. { NGN: "4000.00", GHS: "38.00" }). Only used for raw pricing path. */
  currencyOptions?: Record<string, string>;
  /** Pin the session to a specific billing currency (e.g. "NGN"). Customer pays in that currency only. */
  billingCurrency?: string;
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

  const {
    customerEmail,
    customerName,
    productId,
    amount,
    currency = "USD",
    currencyOptions,
    billingCurrency,
    successUrl,
    cancelUrl,
    metadata,
  } = options;

  const payload: Record<string, unknown> = {
    customer: {
      email: customerEmail,
      name: customerName || customerEmail.split("@")[0],
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  };

  if (productId) {
    // Product already has currency_options (NGN, GHS, etc.) set in the Bachs dashboard.
    // Bachs resolves these automatically at checkout when adaptive pricing is enabled.
    payload.product_cart = [{ product_id: productId }];
  } else if (amount !== undefined) {
    // Raw pricing path: pass currency_options so customers can pay in NGN/GHS/etc.
    const pricingPayload: Record<string, unknown> = {
      amount: typeof amount === "number" ? amount.toFixed(2) : amount,
      currency: currency.toUpperCase(),
    };

    if (currencyOptions && Object.keys(currencyOptions).length > 0) {
      pricingPayload.currency_options = currencyOptions;
    }

    payload.pricing = pricingPayload;
  }

  // Optionally lock the session to a specific currency (e.g. "NGN")
  if (billingCurrency) {
    payload.billing_currency = billingCurrency.toUpperCase();
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
      reason: "User requested cancellation via Sendlib dashboard",
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
      Buffer.from(expected, "hex"),
      Buffer.from(cleanSig, "hex")
    );
  } catch (err) {
    console.error("Signature verification exception:", err);
    return false;
  }
}
