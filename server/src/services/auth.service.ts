import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";
import { generateAccessToken, generateRefreshToken } from "../common/utils/generate.token";
import axios from "axios";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, FRONTEND_URL } = process.env;

export interface GithubProfile {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
}


export const getGithubProfile = async (code: string): Promise<GithubProfile> => {
    const tokenRes = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
        },
        { headers: { Accept: "application/json" } }
    );

    const { access_token, error } = tokenRes.data;
    if (error || !access_token) {
        throw new AppError("Failed to exchange GitHub authorization code", 400);
    }

    const profileRes = await axios.get<GithubProfile>("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    return profileRes.data;
};

/** Find existing user by github_id or create a new one, return JWT tokens */
export const githubOAuthCallback = async (code: string) => {
    const profile = await getGithubProfile(code);

    const githubId = String(profile.id);

    let [user] = await db.select().from(users).where(eq(users.github_id, githubId));

    if (!user) {
        // New user — create account
        const [created] = await db.insert(users).values({
            github_id: githubId,
            github_username: profile.login,
            email: profile.email ?? undefined,
            display_name: profile.name ?? profile.login,
            avatar: profile.avatar_url,
        }).returning();
        user = created;
    } else {
        // Update profile info in case username/avatar changed
        await db.update(users).set({
            github_username: profile.login,
            avatar: profile.avatar_url,
            updated_at: new Date(),
        }).where(eq(users.id, user.id));
    }

    const access_token = generateAccessToken(user.id, user.email ?? "", user.display_name);
    const refresh_token = generateRefreshToken(user.id, user.email ?? "", user.display_name);

    return { user, access_token, refresh_token };
};
