import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const api_keys = pgTable("api_keys", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    hashed_key: varchar("hashed_key", { length: 255 }).notNull().unique(),
    key_prefix: varchar("key_prefix", { length: 12 }).notNull(),
    label: varchar("label", { length: 100 }),
    revoked: boolean("revoked").default(false).notNull(),
    last_used_at: timestamp("last_used_at", { withTimezone: true }).defaultNow(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
})