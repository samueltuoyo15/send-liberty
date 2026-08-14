import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { connectDB } from "@/lib/db";
import { generateAccessToken } from "@/lib/auth";
import User from "@/models/User";

const { NEXT_PUBLIC_APP_URL } = process.env;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const oauthStateCookie = req.cookies.get("oauth_state")?.value;

  if (!code || !stateParam || stateParam !== oauthStateCookie) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=invalid_state_or_code`);
  }

  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
    
    // Use axios instead of googleapis to avoid Zeabur native fetch failures
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const tokens = tokenRes.data;

    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const { id, email, name, picture } = userInfoRes.data;

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
