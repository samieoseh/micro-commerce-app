import { integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../users/schema/user.schema";

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull().default("pending"), 
  total: numeric("total", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});