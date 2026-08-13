import { NextRequest, NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/gmail";
import { rateLimit } from "@/lib/rateLimit";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  // Rate limit: 10 auth attempts per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit("login", `google:${ip}`);
  if (!rl.success) {
    return new NextResponse("Too many auth requests. Try again in a minute.", { status: 429 });
  }

  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  const url = buildGoogleAuthUrl({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "openid email profile",
    state,
  });

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
  return response;
}
