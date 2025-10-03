import { integer, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),

  imageUrl1: varchar("image_url_1", { length: 500 }),
  imageUrl2: varchar("image_url_2", { length: 500 }),
  imageUrl3: varchar("image_url_3", { length: 500 }),
  imageUrl4: varchar("image_url_4", { length: 500 }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});