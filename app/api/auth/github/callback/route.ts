import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";
import { connectDB } from "@/lib/db";
import { generateAccessToken } from "@/lib/auth";
import User from "@/models/User";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, NEXT_PUBLIC_APP_URL } = process.env;

interface GithubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const oauthStateCookie = req.cookies.get("oauth_state")?.value;

  if (!code || !stateParam || stateParam !== oauthStateCookie) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=invalid_state_or_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post<{ access_token?: string; error?: string }>(
      "https://github.com/login/oauth/access_token",
      { client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: "application/json" } }
    );

    const { access_token, error } = tokenRes.data;
    if (error || !access_token) {
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=github_token`);
    }

    // Fetch GitHub profile
    const profileRes = await axios.get<GithubProfile>("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = profileRes.data;

    // Fetch primary email if not in profile
    let email = profile.email;
    if (!email) {
      const emailRes = await axios.get<GithubEmail[]>("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const primary = emailRes.data.find((e) => e.primary && e.verified);
      email = primary?.email ?? null;
    }

    await connectDB();

    const githubId = String(profile.id);
    let user = await User.findOne({ githubId });

    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        user.githubId = githubId;
        user.avatar = profile.avatar_url;
        user.displayName = profile.name ?? profile.login;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        githubId,
        email: email ?? undefined,
        displayName: profile.name ?? profile.login,
        avatar: profile.avatar_url,
      });
    } else {
      user.avatar = profile.avatar_url;
      user.displayName = profile.name ?? profile.login;
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    response.cookies.set("logged_in", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=github_callback`);
  }
}
