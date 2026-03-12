import crypto from "crypto";
import argon2 from "argon2";
import db from "../drizzle/db";
import { api_keys } from "../drizzle/schema/api.key";
import { users } from "../drizzle/schema/users";
import { eq, and } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";

const KEY_PREFIX_LENGTH = 8;

export const generateApiKey = async (userId: string, label?: string) => {
    // Generate a random 32-byte key and encode it as hex (64 chars) prefixed
    const rawKey = crypto.randomBytes(32).toString("hex");
    const prefix = `sl_${rawKey.substring(0, KEY_PREFIX_LENGTH)}`;
    const fullKey = `${prefix}_${rawKey.substring(KEY_PREFIX_LENGTH)}`;

    const hashedKey = await argon2.hash(fullKey);

    const [record] = await db.insert(api_keys)
        .values({
            user_id: userId,
            hashed_key: hashedKey,
            key_prefix: prefix,
            label: label ?? null,
        })
        .returning();

    // Return the raw full key ONCE — it won't be visible again
    return { key: fullKey, id: record.id, prefix: record.key_prefix, label: record.label };
};

export const listApiKeys = async (userId: string) => {
    return db.select({
        id: api_keys.id,
        key_prefix: api_keys.key_prefix,
        label: api_keys.label,
        revoked: api_keys.revoked,
        last_used_at: api_keys.last_used_at,
        created_at: api_keys.created_at,
    }).from(api_keys).where(eq(api_keys.user_id, userId));
};

export const revokeApiKey = async (userId: string, keyId: string) => {
    const [key] = await db.select().from(api_keys).where(
        and(eq(api_keys.id, keyId), eq(api_keys.user_id, userId))
    );
    if (!key) throw new AppError("API key not found", 404);

    await db.update(api_keys).set({ revoked: true }).where(eq(api_keys.id, keyId));
};

export const deleteApiKey = async (userId: string, keyId: string) => {
    const [key] = await db.select().from(api_keys).where(
        and(eq(api_keys.id, keyId), eq(api_keys.user_id, userId))
    );
    if (!key) throw new AppError("API key not found", 404);

    await db.delete(api_keys).where(eq(api_keys.id, keyId));
};

/** Verify an API key and return the associated user. Updates last_used_at. */
export const verifyApiKey = async (rawKey: string) => {
    // The prefix is the first part before the second underscore group
    // Format: sl_XXXXXXXX_YYYYYY...
    const parts = rawKey.split("_");
    if (parts.length < 3) throw new AppError("Invalid API key format", 401);

    const prefix = `${parts[0]}_${parts[1]}`;

    // Find by prefix
    const candidates = await db.select().from(api_keys).where(
        and(eq(api_keys.key_prefix, prefix), eq(api_keys.revoked, false))
    );

    for (const candidate of candidates) {
        const valid = await argon2.verify(candidate.hashed_key, rawKey);
        if (valid) {
            // Update last_used_at
            await db.update(api_keys)
                .set({ last_used_at: new Date() })
                .where(eq(api_keys.id, candidate.id));

            // Fetch user
            const [user] = await db.select().from(users).where(eq(users.id, candidate.user_id));
            if (!user) throw new AppError("API key user not found", 401);

            return user;
        }
    }

    throw new AppError("Invalid or revoked API key", 401);
};
