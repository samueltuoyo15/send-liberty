import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";


export const gmail_accounts = pgTable("gmail_accounts", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    gmail_email: varchar("gmail_email", { length: 255 }).notNull(),
    encrypted_access_token: text("encrypted_access_token").notNull(),
    encrypted_refresh_token: text("encrypted_refresh_token").notNull(),
    token_expires_at: timestamp("token_expires_at", { withTimezone: true }).notNull(),
    connected: boolean("connected").default(true).notNull(),
    last_error: text("last_error"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});