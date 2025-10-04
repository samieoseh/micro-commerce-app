import request from "supertest";
import app from "../../../app"; // your Express app
import { setupTestDb } from "../../../tests/db-setup";
import { authService } from "../../auth/auth.service";
import { products } from "../../products/schema/product.schema";

let user: any;
let token: string;
let product: any;

beforeEach(async () => {
  const testDb = await setupTestDb();
  (authService as any).db = testDb;

  // seed a user & get auth token
  user = await authService.signup({ email: "cartuser@example.com", password: "Password@123" });
  token = user.accessToken;

  // seed a product
  const [inserted] = await testDb.insert(products).values({
    name: "Cart Product",
    description: "A product for cart test",
    price: "25.5",
    stock: 100,
    category: "category1",
    brand: "brand1",
    imageUrl: "http://example.com/img.jpg",
  }).returning();
  product = inserted;
});

describe("Cart API Integration", () => {
  // ---------------------------
  describe("POST /api/v1/cart", () => {
    it("creates a cart for a user", async () => {
      const res = await request(app)
        .post("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.userId).toBe(user.id);
    });

    it("rejects duplicate cart creation", async () => {
      await request(app)
        .post("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`);

      const res = await request(app)
        .post("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already has a cart/i);
    });
  });

  // ---------------------------
  describe("GET /api/v1/cart", () => {
    it("fetches the user’s cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.items).toEqual([]);
    });

    it("returns 404 if cart does not exist", async () => {
      const res = await request(app)
        .get("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  // ---------------------------
  describe("POST /api/v1/cart/items", () => {
    it("adds an item to the cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: product.id, quantity: 2 });

      expect(res.status).toBe(201);
      expect(res.body.data.productId).toBe(product.id);
      expect(res.body.data.quantity).toBe(2);
    });

    it("returns 404 if product not found", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: 9999, quantity: 1 });

      expect(res.status).toBe(404);
    });
  });

  // ---------------------------
  describe("PATCH /api/v1/cart/items/:productId", () => {
    it("updates quantity of an item", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      await request(app).post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 });

      const res = await request(app)
        .patch(`/api/v1/cart/items/${product.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(5);
    });

    it("returns 404 if item not in cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .patch("/api/v1/cart/items/9999")
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(404);
    });
  });

  // ---------------------------
  describe("DELETE /api/v1/cart/items/:productId", () => {
    it("removes an item from the cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      await request(app).post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 });

      const res = await request(app)
        .delete(`/api/v1/cart/items/${product.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });
  });

  // ---------------------------
  describe("DELETE /api/v1/cart", () => {
    it("deletes the entire cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      const res = await request(app)
        .delete("/api/v1/cart")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });
  });

  // ---------------------------
  describe("POST /api/v1/cart/clear", () => {
    it("clears all items from the cart", async () => {
      await request(app).post("/api/v1/cart").set("Authorization", `Bearer ${token}`);
      await request(app).post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: product.id, quantity: 3 });

      const res = await request(app)
        .post("/api/v1/cart/clear")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/cleared/i);
    });
  });
});
