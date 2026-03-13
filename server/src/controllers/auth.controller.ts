import type { NextFunction, Request, Response } from "express";
import { githubOAuthCallback } from "../services/auth.service";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../common/utils/generate.token";

const { GITHUB_CLIENT_ID, FRONTEND_URL } = process.env;

/**
 * GET /api/v1/auth/github
 * Redirect user to GitHub OAuth consent page
 */
export const githubRedirectHandler = (_req: Request, res: Response) => {
    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID!,
        scope: "user:email read:user",
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

/**
 * GET /api/v1/auth/github/callback?code=...
 * Exchange code for tokens, set cookies, redirect to frontend
 */
export const githubCallbackHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.query as { code: string };
        if (!code) throw new Error("Missing OAuth code");

        const { access_token, refresh_token } = await githubOAuthCallback(code);

        const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
        };

        res.cookie("access_token", access_token, { ...cookieOpts, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie("refresh_token", refresh_token, { ...cookieOpts, maxAge: REFRESH_TOKEN_MAX_AGE });

        res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/v1/auth/logout
 */
export const logoutHandler = (_req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ success: true, message: "Logged out" });
};