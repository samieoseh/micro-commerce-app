import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // hashed
  role: varchar("role", { length: 100 }).default("user")
});