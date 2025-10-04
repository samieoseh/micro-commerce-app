import { setupTestDb } from "../../../tests/db-setup";
import { eq } from "drizzle-orm";

import CartsService from "../carts.service";
import { carts } from "../schema/carts.schema";
import { products } from "../../products/schema/product.schema";
import { users } from "../../users/schema/user.schema";

describe("CartsService", () => {
  let db: any;

  beforeEach(async () => {
    db = await setupTestDb();
    (CartsService as any).db = db;

    await db.insert(users).values({ email: "cartuser@example.com", password: "hashed" });
    await db.insert(products).values({
      name: "Test Product",
      description: "A test product",
      price: 19.99,
      stock: 10,
      category: "test",
      brand: "brandX",
      imageUrl: "http://example.com/img.jpg"
    });
  });

  describe("createCart", () => {
    it("creates a new cart for a user", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await CartsService.createCart(user.id);

      expect(cart).toHaveProperty("id");
      expect(cart.userId).toBe(user.id);

      const found = await db.select().from(carts).where(eq(carts.userId, user.id));
      expect(found.length).toBe(1);
    });

    it("prevents duplicate carts for same user", async () => {
      const [user] = await db.select().from(users).limit(1);
      await CartsService.createCart(user.id);

      await expect(CartsService.createCart(user.id))
        .rejects.toThrow(/already has a cart/i);
    });
  });

  describe("getCart", () => {
    it("returns the user’s cart with items", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await CartsService.createCart(user.id);

      const result = await CartsService.getCart(user.id);

      expect(result).toHaveProperty("id", cart.id);
      expect(result.items).toEqual([]); 
    });

    it("returns null if user has no cart", async () => {
      const result = await CartsService.getCart(9999);
      expect(result).toBeNull();
    });
  });

  describe("addItem", () => {
    it("adds a product to cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      const item = await CartsService.addItem(cart.id, product.id, 2);

      expect(item.cartId).toBe(cart.id);
      expect(item.productId).toBe(product.id);
      expect(item.quantity).toBe(2);
    });

    it("increases quantity if product already in cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.addItem(cart.id, product.id, 1);
      const updated = await CartsService.addItem(cart.id, product.id, 3);

      expect(updated.quantity).toBe(4);
    });

    it("throws if product does not exist", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await CartsService.createCart(user.id);

      await expect(CartsService.addItem(cart.id, 9999, 1))
        .rejects.toThrow(/product not found/i);
    });
  });

  describe("getItems", () => {
    it("returns all items in a cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.addItem(cart.id, product.id, 2);
      const items = await CartsService.getItems(cart.id);

      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it("returns empty array for empty cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await CartsService.createCart(user.id);

      const items = await CartsService.getItems(cart.id);
      expect(items).toEqual([]);
    });
  });

  describe("updateItem", () => {
    it("updates quantity of existing item", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.addItem(cart.id, product.id, 1);
      const updated = await CartsService.updateItem(cart.id, product.id, 5);

      expect(updated.quantity).toBe(5);
    });

    it("throws if item not in cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await expect(CartsService.updateItem(cart.id, product.id, 5))
        .rejects.toThrow(/not in cart/i);
    });
  });

  describe("deleteItem", () => {
    it("removes an item from cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.addItem(cart.id, product.id, 1);
      await CartsService.deleteItem(cart.id, product.id);

      const items = await CartsService.getItems(cart.id);
      expect(items).toHaveLength(0);
    });
  });

  describe("clearItems", () => {
    it("empties the cart completely", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.addItem(cart.id, product.id, 2);
      await CartsService.clearItems(cart.id);

      const items = await CartsService.getItems(cart.id);
      expect(items).toEqual([]);
    });
  });

  describe("deleteCart", () => {
    it("deletes the user’s cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await CartsService.createCart(user.id);

      await CartsService.deleteCart(cart.id);

      const found = await db.select().from(carts).where(eq(carts.id, cart.id));
      expect(found.length).toBe(0);
    });

    it("throws if cart doesn’t exist", async () => {
      await expect(CartsService.deleteCart(9999))
        .rejects.toThrow(/not found/i);
    });
  });
});
