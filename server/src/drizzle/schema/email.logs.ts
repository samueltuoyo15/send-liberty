import { pgTable, text, pgEnum, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const emailStatusEnum = pgEnum("email_status", ["sent", "failed"]);
export const serviceTypeEnum = pgEnum("service_type", ["gmail", "smtp"]);

export const email_logs = pgTable("email_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    to: varchar("to", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 500 }),
    status: emailStatusEnum("status").notNull(),
    service_type: serviceTypeEnum("service_type").notNull(),
    message_id: varchar("message_id", { length: 255 }),
    error_message: text("error_message"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
})