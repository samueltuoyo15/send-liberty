import { pgTable, uuid, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const batchJobStatusEnum = pgEnum("batch_job_status", [
    "pending",
    "running",
    "completed",
    "partial",
    "failed",
    "cancelled"
]);

export const batch_jobs = pgTable("batch_jobs", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    api_key_id: uuid("api_key_id"),
    name: text("name"),                                         // optional label e.g. "March Newsletter"
    total_count: integer("total_count").notNull(),
    sent_count: integer("sent_count").default(0).notNull(),
    failed_count: integer("failed_count").default(0).notNull(),
    batch_size: integer("batch_size").default(50).notNull(),
    batch_delay_ms: integer("batch_delay_ms").default(1000).notNull(),
    max_retries: integer("max_retries").default(3).notNull(),
    job_ids: text("job_ids"),                                  // JSON array of BullMQ job IDs
    status: batchJobStatusEnum("status").default("pending").notNull(),
    scheduled_at: timestamp("scheduled_at", { withTimezone: true }),
    started_at: timestamp("started_at", { withTimezone: true }),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    error_message: text("error_message"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
