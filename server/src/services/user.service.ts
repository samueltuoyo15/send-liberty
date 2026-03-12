import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";

export const getProfile = async (userId: string) => {
    const [user] = await db.select({
        id: users.id,
        email: users.email,
        display_name: users.display_name,
        avatar: users.avatar,
        default_reply_to: users.default_reply_to,
        mode: users.mode,
        credits: users.credits,
        monthly_usage: users.monthly_usage,
        monthly_limit: users.monthly_limit,
        created_at: users.created_at,
    }).from(users).where(eq(users.id, userId));

    if (!user) throw new AppError("User not found", 404);
    return user;
};

export const updateProfile = async (
    userId: string,
    data: { display_name?: string; avatar?: string; default_reply_to?: string }
) => {
    const [updated] = await db.update(users)
        .set({ ...data, updated_at: new Date() })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            email: users.email,
            display_name: users.display_name,
            avatar: users.avatar,
            default_reply_to: users.default_reply_to,
            mode: users.mode,
        });

    if (!updated) throw new AppError("User not found", 404);
    return updated;
};

export const switchMode = async (userId: string, mode: "test_mode" | "live_mode") => {
    const [updated] = await db.update(users)
        .set({ mode, updated_at: new Date() })
        .where(eq(users.id, userId))
        .returning({ id: users.id, mode: users.mode });

    if (!updated) throw new AppError("User not found", 404);
    return updated;
};
