import Paystack from "paystack-api";
import db from "../drizzle/db";
import { users } from "../drizzle/schema/users";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/global.error.handler";
import logger from "../common/logger/logger";

const { PAYSTACK_SECRET_KEY } = process.env;

if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
}

const paystack = Paystack(PAYSTACK_SECRET_KEY);

export const CREDIT_PACKAGES = {
    "100": { credits: 100, amount: 50000 },
    "500": { credits: 500, amount: 225000 },
    "1000": { credits: 1000, amount: 400000 },
    "2500": { credits: 2500, amount: 900000 },
};

export const initializePayment = async (userId: string, packageId: keyof typeof CREDIT_PACKAGES) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new AppError("User not found", 404);

    const pkg = CREDIT_PACKAGES[packageId];
    if (!pkg) throw new AppError("Invalid package", 400);

    if (!user.email) throw new AppError("Email is required for payment", 400);

    const response = await paystack.transaction.initialize({
        email: user.email,
        amount: pkg.amount,
        metadata: {
            userId,
            packageId,
            credits: pkg.credits,
        },
        callback_url: `${process.env.FRONTEND_URL}/dashboard/billing?payment=success`,
    });

    return {
        authorization_url: response.data.authorization_url,
        access_code: response.data.access_code,
        reference: response.data.reference,
    };
};

export const verifyPayment = async (reference: string) => {
    const response = await paystack.transaction.verify(reference);

    if (response.data.status !== "success") {
        throw new AppError("Payment verification failed", 400);
    }

    const { userId, credits } = response.data.metadata as { userId: string; credits: number };

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new AppError("User not found", 404);

    const [updated] = await db
        .update(users)
        .set({
            credits: user.credits + credits,
            updated_at: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

    logger.info({ userId, credits, reference }, "Credits added successfully");

    return updated;
};

export const handleWebhook = async (event: any) => {
    if (event.event === "charge.success") {
        const { reference, metadata } = event.data;
        const { userId, credits } = metadata;

        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
            logger.error({ userId }, "User not found in webhook");
            return;
        }

        await db
            .update(users)
            .set({
                credits: user.credits + credits,
                updated_at: new Date(),
            })
            .where(eq(users.id, userId));

        logger.info({ userId, credits, reference }, "Credits added via webhook");
    }
};
