import { text, pgTable, uuid, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const modeEnum = pgEnum("mode", ["test_mode", "live_mode"])

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    github_id: varchar("github_id", { length: 50 }).notNull().unique(),
    github_username: varchar("github_username", { length: 100 }),
    email: varchar("email", { length: 255 }).unique(),
    display_name: varchar("display_name", { length: 80 }),
    avatar: text("avatar"),
    default_reply_to: varchar("default_reply_to", { length: 255 }),
    mode: modeEnum("mode").default("test_mode").notNull(),
    credits: integer("credits").default(50).notNull(),
    monthly_usage: integer("monthly_usage").default(0).notNull(),
    monthly_limit: integer("monthly_limit").default(50).notNull(),
    reset_date: timestamp("reset_date", { withTimezone: true }).defaultNow().notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});