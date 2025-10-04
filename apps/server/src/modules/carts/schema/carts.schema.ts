import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../users/schema/user.schema"
import { cartItems } from "./carts-item.schema";
import { relations } from "drizzle-orm";

export const carts = pgTable("carts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
