import { setupTestDb } from "../../../tests/db-setup";
import { eq } from "drizzle-orm";

import  { CartsService } from "../carts.service";
import { carts } from "../schema/carts.schema";
import { products } from "../../products/schema/product.schema";
import { users } from "../../users/schema/user.schema";
import { productsService } from "../../products/products.service";

describe("CartsService", () => {
  let db: any;
  let service: CartsService;
  

  beforeEach(async () => {
    db = await setupTestDb();
    service = new CartsService(db);
    (productsService as any).db = db;

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
      const cart = await service.createCart(user.id);

      expect(cart).toHaveProperty("id");
      expect(cart.userId).toBe(user.id);

      const found = await db.select().from(carts).where(eq(carts.userId, user.id));
      expect(found.length).toBe(1);
    });

    it("prevents duplicate carts for same user", async () => {
      const [user] = await db.select().from(users).limit(1);
      await service.createCart(user.id);

      await expect(service.createCart(user.id))
        .rejects.toThrow(/already has a cart/i);
    });
  });

  describe("getCart", () => {
    it("returns the user’s cart with items", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await service.createCart(user.id);

      const result = await service.getCart(user.id);

      expect(result).toHaveProperty("id", cart.id);
    });

    it("returns null if user has no cart", async () => {
      const result = await service.getCart(9999);
      expect(result).toBeUndefined();
    });
  });

  describe("addItem", () => {
    it("adds a product to cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      const item = await service.addItem(user.id, {productId: product.id, price: "20", quantity: 2, cartId:cart.id});

      expect(item.cartId).toBe(cart.id);
      expect(item.productId).toBe(product.id);
      expect(item.quantity).toBe(2);
    });

    it("increases quantity if product already in cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      await service.addItem(user.id, {cartId: cart.id, productId: product.id, price: "100", quantity: 1});
      const updated = await service.addItem(user.id, {cartId: cart.id, productId: product.id, price: "300", quantity: 3});

      expect(updated.quantity).toBe(4);
    });

    it("throws if product does not exist", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await service.createCart(user.id);

      await expect(service.addItem(user.id, {cartId: cart.id, productId: 9999, price:"100", quantity: 1}))
        .rejects.toThrow(/product not found/i);
    });
  });

  describe("getItems", () => {
    it("returns all items in a cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      await service.addItem(user.id, {cartId: cart.id, productId: product.id, price:"100", quantity:2})
      const result = await service.getItems(cart.id);

      expect(result.items.length).toBe(1);
      expect(result.items[0].quantity).toBe(2);
    });

    it("returns empty array for empty cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await service.createCart(user.id);

      const result = await service.getItems(cart.id);
      expect(result.items).toEqual([]);
    });
  });

  describe("updateItem", () => {
    it("updates quantity of existing item", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      const item = await service.addItem(user.id, {cartId: cart.id, productId: product.id, price: "100", quantity: 1});
      const updated = await service.updateItem(user.id, item.id, {productId: product.id, quantity: 5});

      expect(updated.quantity).toBe(5);
    });

    it("throws if item not in cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      await expect(service.updateItem(user.id, 1, {productId: product.id, quantity: 5}))
        .rejects.toThrow(/not found in cart/i);
    });
  });

  describe("deleteItem", () => {
    it("removes an item from cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      const item = await service.addItem(user.id, {cartId: cart.id, productId: product.id, price:"100", quantity: 1});
      await service.deleteItem(user.id, item.id);

      await expect(service.getItems(cart.id))
        .rejects.toThrow(/Cart not found/i);
    });
  });

  describe("clearItems", () => {
    it("empties the cart completely", async () => {
      const [user] = await db.select().from(users).limit(1);
      const [product] = await db.select().from(products).limit(1);
      const cart = await service.createCart(user.id);

      await service.addItem(user.id, {cartId: cart.id, productId: product.id, quantity: 2, price: "100"});
      await service.clearItems(cart.id);

      await expect(service.getItems(cart.id))
        .rejects.toThrow(/Cart not found/i);
    });
  });

  describe("deleteCart", () => {
    it("deletes the user’s cart", async () => {
      const [user] = await db.select().from(users).limit(1);
      const cart = await service.createCart(user.id);

      await service.deleteCart(cart.id);

      const found = await db.select().from(carts).where(eq(carts.id, cart.id));
      expect(found.length).toBe(0);
    });

    it("throws if cart doesn’t exist", async () => {
      await expect(service.deleteCart(9999))
        .rejects.toThrow(/not found/i);
    });
  });
});
