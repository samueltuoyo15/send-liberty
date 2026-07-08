import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/gmail";

export async function GET() {
  // Use a placeholder state for login OAuth, different from Gmail connect
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
