import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from '../../db/schema';
import { db } from "../../db";
import { ApiError } from "../../utils/api-error";
import { cartItems, } from "../carts/schema/carts-item.schema";
import { and, eq } from "drizzle-orm";
import { carts } from "../carts/schema/carts.schema";
import { products } from "../products/schema/product.schema";
import { productsService } from "../products/products.service";
import { orders } from "./schema/orders.schema";
import { orderItems } from "./schema/order-items.schema";

// orders.service.ts
class OrdersService {
  constructor(private db: NodePgDatabase<schema.Schema> | PgliteDatabase<schema.Schema>) {}
  
  async getOrders(userId: number) {
    const userOrders = await this.db.select().from(orders).where(eq(orders.userId, userId));
    return userOrders
  }

  async getOrder(userId: number, id: number) {
    const [order] = await this.db.select().from(orders).where(
      and(
        eq(orders.id, id),
        eq(orders.userId, userId)
      )
    )

    return order
  }

  async createOrder(userId: number) {
    return this.db.transaction(async (tx) => {
      const [cart] = await tx.select().from(carts).where(eq(carts.userId, userId));

       if (!cart) {
        throw new ApiError(404, "Cart not found")
       }

      const itemsInCart = await tx.select().from(cartItems).where(eq(cartItems.cartId, cart.id));

      const total = itemsInCart.reduce((sum, item) => {
          return sum + (item.quantity * +item.price)
      }, 0)


      for(const item of itemsInCart) {
        const [product] = await tx.select().from(products).where(eq(products.id, item.productId));
        if (!product) {
          throw new ApiError(404, "Product not found")
        }

        if(product.stock < item.quantity) {
          throw new ApiError(400, "Stock less than requested quantity")
        }

        await tx.update(products).set({
          stock: product.stock - item.quantity,
        }) .where(eq(products.id, product.id));
      }
      
      const [order] = await tx.insert(orders).values({
        userId,
        status: "pending",
        total: total.toString()
      }).returning()


      for (const item of itemsInCart) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          userId
        });
      }

       await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
       await tx.delete(carts).where(eq(carts.userId, userId))

       // TODO: Implemented payment and mark status to paid

       return {id: order.id}
    })
  }
  
  async getOrderHistory(userId: number, id: number) {
    const orderHistory = await this.db.select().from(orderItems).where(
      and(
        eq(orderItems.orderId, id),
        eq(orderItems.userId, userId)
      )
    )

    return orderHistory
  }
}

const ordersService= new OrdersService(db)
export  {ordersService, OrdersService};
