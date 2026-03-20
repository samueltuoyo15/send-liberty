import { PgBoss } from "pg-boss";
import db from "../../drizzle/db";
import { users } from "../../drizzle/schema/users";
import { sql } from "drizzle-orm";
import logger from "../logger/logger";

const { DATABASE_URL } = process.env;

let boss: PgBoss | null = null;

export const initCreditResetJob = async () => {
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    boss = new PgBoss(DATABASE_URL);

    boss.on("error", (error: Error) => {
        logger.error({ error }, "PgBoss error");
    });

    await boss.start();
    logger.info("PgBoss started successfully");

    await boss.createQueue("monthly-credit-reset");

    await boss.schedule("monthly-credit-reset", "0 0 1 * *", {}, {
        tz: "UTC"
    });

    await boss.work("monthly-credit-reset", async () => {
        try {
            logger.info("Starting monthly credit reset job");

            const result = await db
                .update(users)
                .set({
                    credits: sql`${users.monthly_limit}`,
                    monthly_usage: 0,
                    reset_date: new Date(),
                    updated_at: new Date(),
                })
                .returning({ id: users.id });

            logger.info({ count: result.length }, "Monthly credits reset completed");
        } catch (error) {
            logger.error({ error }, "Error resetting monthly credits");
            throw error;
        }
    });

    logger.info("Monthly credit reset job scheduled (runs 1st of every month at midnight UTC)");
};

export const stopCreditResetJob = async () => {
    if (boss) {
        await boss.stop();
        logger.info("PgBoss stopped");
    }
};

export const getBossInstance = () => boss;
