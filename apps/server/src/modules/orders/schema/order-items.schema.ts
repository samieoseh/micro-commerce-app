import { integer, numeric, pgTable } from "drizzle-orm/pg-core";
import { orders } from "./orders.schema";
import { products } from "../../products/schema/product.schema";
import { users } from "../../users/schema/user.schema";

export const orderItems = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "restrict" }) 
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), 
});