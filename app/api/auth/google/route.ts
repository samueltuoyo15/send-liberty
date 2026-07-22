import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/gmail";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  // Rate limit: 10 auth attempts per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit("auth", `google:${ip}`);
  if (!rl.success) {
    return new NextResponse("Too many auth requests. Try again in a minute.", { status: 429 });
  }

  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const oauth2Client = createOAuthClient(redirectUri);
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "profile"],
    state: "login",
    redirect_uri: redirectUri,
  });
  return NextResponse.redirect(url);
}
