import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { connectDB } from "@/lib/db";
import { generateAccessToken } from "@/lib/auth";
import { createOAuthClient } from "@/lib/gmail";
import User from "@/models/User";

const { NEXT_PUBLIC_APP_URL } = process.env;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=missing_code`);
  }

  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
    const oauth2Client = createOAuthClient(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();
    const { id, email, name, picture } = userInfo.data;

    if (!id) {
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_profile`);
    }

    await connectDB();

    let user = await User.findOne({ googleId: id });
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = id;
        user.avatar = picture ?? user.avatar;
        user.displayName = name ?? user.displayName;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        googleId: id,
        email: email ?? undefined,
        displayName: name ?? email ?? "User",
        avatar: picture ?? undefined,
      });
    } else {
      user.avatar = picture ?? user.avatar;
      user.displayName = name ?? user.displayName;
      if (email && !user.email) user.email = email;
      await user.save();
    }

    const jwt = generateAccessToken({
      id: user._id.toString(),
      email: user.email ?? null,
      displayName: user.displayName,
    });

    const response = NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/dashboard`);
    response.cookies.set("access_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    response.cookies.set("logged_in", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_callback`);
  }
}
