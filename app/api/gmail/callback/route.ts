import { NextRequest, NextResponse } from "next/server";
import { handleGmailCallback } from "@/lib/gmail";

const { NEXT_PUBLIC_APP_URL } = process.env;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/dashboard?gmail_error=missing_params`);
  }

  try {
    const { gmailEmail } = await handleGmailCallback(code, userId);
    return NextResponse.redirect(
      `${NEXT_PUBLIC_APP_URL}/dashboard/accounts?gmail_connected=true&email=${encodeURIComponent(gmailEmail)}`
    );
  } catch (err) {
    console.error("Gmail callback error:", err);
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/dashboard/accounts?gmail_error=callback_failed`);
  }
}
