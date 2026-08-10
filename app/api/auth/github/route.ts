import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import crypto from "crypto";

const { GITHUB_CLIENT_ID } = process.env;

export async function GET(req: NextRequest) {
  // Rate limit: 10 auth attempts per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit("login", `github:${ip}`);
  if (!rl.success) {
    return new NextResponse("Too many auth requests. Try again in a minute.", { status: 429 });
  }

  // Sign a short-lived state token to prevent CSRF
  const nonce = crypto.randomBytes(12).toString("hex");
  const secret = process.env.JWT_SECRET!;
  const timestamp = Date.now();
  const statePayload = `${nonce}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(statePayload).digest("hex");
  const state = `${statePayload}:${hmac}`;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID!,
    scope: "user:email read:user",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
    state,
  });
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
  return response;
}
