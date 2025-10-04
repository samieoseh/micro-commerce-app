import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AddCartItemPayload, Cart, UpdateCartItemPayload } from "./types/cart";
import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from '../../db/schema';
import { db } from "../../db";
import { carts } from "./schema/carts.schema";
import { and, eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error";
import { cartItems} from "./schema/carts-item.schema";
import { productsService } from "../products/products.service";


class CartsService {
  constructor(private db: NodePgDatabase<schema.Schema> | PgliteDatabase<schema.Schema>) {}
  
  async createCart(userId: number) {
    const cart: Cart = {
      userId
    }

    const existingCart = await this.getCart(userId);

    if (existingCart) {
      throw new ApiError(409, "User already has a cart")
    }

    const [newCart] = await this.db.insert(carts).values(cart).returning();

    return newCart
  }

  async getCart(userId: number) {
    const [cart] = await this.db.select().from(carts).where(eq(carts.userId, userId));

    return cart
  }

  async deleteCart(userId: number) {
    const cart = await this.getCart(userId);

    if (!cart) {
      throw new ApiError(404, "Cart not found")
    }

    return await this.db.delete(carts).where(eq(carts.userId, userId));
  }

  async addItem(userId: number, payload: AddCartItemPayload) {
    let cart = await this.getCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const product = await productsService.getProductById(payload.productId);

    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    const [existingItem] = await this.db.select().from(cartItems).where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, payload.productId)
    ))
    
    if (existingItem) {
      const [updated] = await this.db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + payload?.quantity,
          price: payload.price, 
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      return updated;
    } else {
      const [newItem] = await this.db
        .insert(cartItems)
        .values({
          cartId: cart.id,
          productId: payload.productId,
          quantity: payload.quantity,
          price: payload.price,
          userId
        })
        .returning();

      return newItem;
    }
  }

  async clearItems(userId: number) {
    await this.db.transaction(async (tx) => {
      const [cart] = await tx.select().from(carts).where(eq(carts.userId, userId));

      if (!cart) {
        throw new ApiError(404, "Cart not found")
      }

       await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      await tx.delete(carts).where(eq(carts.userId, userId));
    })
  }

  async getItems(userId: number) {
    const cart = await this.getCart(userId);

    if (!cart) {
      throw new ApiError(404, "Cart not found")
    }

    const items = await this.db.select().from(cartItems).where(eq(cartItems.cartId, cart.id));

    const total = items.reduce((sum, item) => {
      return sum + (item.quantity * +item.price)
    }, 0)

    return {items, total, cartId: cart.id};

  }

  async updateItem(userId: number, itemId: number, payload: UpdateCartItemPayload) {
    const item = await this.getItem(userId, itemId);
    if (!item) {
      throw new ApiError(404, "Item not found in cart")
    }

    const [updatedItem] = await this.db.update(cartItems).set(payload).where(and(
      eq(cartItems.id, itemId),
      eq(cartItems.userId, userId)
    )).returning()

    return updatedItem;
  }

  async deleteItem(userId: number, itemId: number) {
    await this.db.transaction(async (tx) => {
      const [item] = await tx.select().from(cartItems).where(and(
        eq(cartItems.id, itemId),
        eq(cartItems.userId, userId)
      ));

      if (!item) {
        throw new ApiError(404, "Item not found in cart");
      }

      await tx.delete(cartItems).where(eq(cartItems.id, itemId));

      const items = await tx.select().from(cartItems).where(eq(cartItems.cartId, itemId));

      if (items.length === 0) {
        await tx.delete(carts).where(eq(carts.id, item.cartId));
      }
    });
  }

  async getItem(userId: number, itemId: number) {
    const [item] = await this.db.select().from(cartItems).where(and(
      eq(cartItems.id, itemId),
      eq(cartItems.userId, userId)
    ));

    return item;
  }
}

const cartsService= new CartsService(db)
export  {cartsService, CartsService};
