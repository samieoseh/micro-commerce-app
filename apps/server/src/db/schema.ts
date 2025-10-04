import { users } from "../modules/users/schema/user.schema";
import { products } from "../modules/products/schema/product.schema";
import { carts } from "../modules/carts/schema/carts.schema";
import { cartItems } from "../modules/carts/schema/carts-item.schema";
import { orders } from "../modules/orders/schema/orders.schema";
import { orderItems } from "../modules/orders/schema/order-items.schema";

export const schema = {
  users,
  products,
  carts,
  cartItems,
  orders,
  orderItems,
} as const;

export type Schema = typeof schema;