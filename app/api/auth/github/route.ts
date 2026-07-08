import { NextResponse } from "next/server";

const { GITHUB_CLIENT_ID } = process.env;

export async function GET() {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID!,
    scope: "user:email read:user",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
  });
  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
