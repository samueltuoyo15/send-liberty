import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { eq } from "drizzle-orm"
import argon2 from "argon2";
import { AppError } from "../middlewares/global.error.handler";
import { generateAccessToken, generateRefreshToken } from "../common/utils/generate.token";

export const register = async (email: string, password: string, display_name?: string, avatar?: string) => {
    const userExists = await db.select().from(users).where(eq(users.email, email));

    if (userExists.length > 0) throw new AppError("User already exists", 409)

    const password_hash = await argon2.hash(password);

    const [user] = await db.insert(users).values({
        email,
        password_hash,
        display_name,
        avatar
    }).returning();

    const access_token = generateAccessToken(user.id, user.email, user.display_name)
    return { user, access_token }
}

export const login = async (email: string, password: string): Promise<{ access_token: string, refresh_token: string }> => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) throw new AppError("Invalid email or password", 401);

    const validPassword = await argon2.verify(user.password_hash, password);
    if (!validPassword) throw new AppError("Invalid email or password", 401);

    const access_token = generateAccessToken(user.id, user.email, user.display_name);
    const refresh_token = generateRefreshToken(user.id, user.email, user.display_name);

    return { access_token, refresh_token }
}