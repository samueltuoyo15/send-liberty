import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const scheduledEmailStatusEnum = pgEnum("scheduled_email_status", [
    "pending",
    "sent",
    "failed",
    "cancelled"
]);

export const scheduled_emails = pgTable("scheduled_emails", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    api_key_id: uuid("api_key_id"),
    job_id: varchar("job_id", { length: 255 }),           // BullMQ job ID for cancellation
    to: text("to").notNull(),                              // JSON stringified (string | string[])
    subject: varchar("subject", { length: 500 }).notNull(),
    html: text("html"),
    body: text("body"),
    cc: text("cc"),
    bcc: text("bcc"),
    reply_to: varchar("reply_to", { length: 255 }),
    service: varchar("service", { length: 20 }).default("gmail"),
    scheduled_at: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    status: scheduledEmailStatusEnum("status").default("pending").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    max_retries: integer("max_retries").default(3).notNull(),
    error_message: text("error_message"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
