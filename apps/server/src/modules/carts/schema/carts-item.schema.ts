import { integer, numeric, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { carts } from "./carts.schema";
import { products } from "../../products/schema/product.schema";

export const cartItems = pgTable("cart_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    cartId: integer("cart_id")
        .references(() => carts.id, { onDelete: "cascade" })
        .notNull(),
    productId: integer("product_id")
        .references(() => products.id, { onDelete: "cascade" })
        .notNull(),
    quantity: integer("quantity").notNull().default(1),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(), 
});