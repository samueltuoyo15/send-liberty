import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { createBachsCheckoutSession } from "@/lib/bachs";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    if (!user.email) {
      return NextResponse.json(
        { success: false, message: "Your account does not have an email address associated with it." },
        { status: 400 }
      );
    }

    const requestHost = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (requestHost.includes("localhost") ? "http" : "https");
    const requestOrigin = `${protocol}://${requestHost}`;

    // Bachs requires a public HTTPS return URL for checkouts.
    // If running on localhost, use NEXT_PUBLIC_APP_URL or APP_URL (e.g. ngrok) if provided.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    const origin = appUrl ? appUrl.replace(/\/$/, "") : requestOrigin;

    const productId = process.env.BACHS_PRODUCT_ID?.trim();

    const session = await createBachsCheckoutSession({
      customerEmail: user.email,
      customerName: user.displayName,
      productId: productId || undefined,
      amount: productId ? undefined : 2,
      currency: "USD",
      successUrl: `${origin}/dashboard/settings?billing=success`,
      cancelUrl: `${origin}/dashboard/settings?billing=cancel`,
      metadata: {
        userId: user.id,
        plan: "pro",
      },
    });

    return NextResponse.json({
      success: true,
      url: session.checkout_url,
      checkoutId: session.checkout_id,
    });
  } catch (err: unknown) {
    if (err instanceof Response) return err;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bachsErr = (err as any)?.response?.data;
    console.error("[Bachs Checkout API Error]:", bachsErr || (err as Error).message);

    const errorDetail = typeof bachsErr === "object" ? JSON.stringify(bachsErr) : (bachsErr || (err as Error).message || "Failed to initialize Bachs checkout session");
    return NextResponse.json(
      {
        success: false,
        message: `Bachs Checkout Error: ${errorDetail}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { status: (err as any)?.response?.status || 500 }
    );
  }
}
