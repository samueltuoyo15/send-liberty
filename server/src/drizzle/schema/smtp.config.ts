import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const smtp_config = pgTable("smtp_configs", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    host: varchar("host", { length: 255 }).notNull(),
    port: integer("port").notNull(),
    secure: boolean("secure").default(true).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    encrypted_password: text("encrypted_password").notNull(),
    from_email: varchar("from_email", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});