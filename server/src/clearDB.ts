import db from "./drizzle/db";
import { sql } from "drizzle-orm";

const clearData = async () => {
    try {
        console.log("Emptying database to prepare for GitHub OAuth migration...");
        await db.execute(sql`TRUNCATE TABLE users CASCADE;`);
        console.log("Database tables truncated.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

clearData();
