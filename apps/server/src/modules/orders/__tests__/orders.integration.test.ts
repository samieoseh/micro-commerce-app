
import request from "supertest";
import app from "../../../app";
import { setupTestDb } from "../../../tests/db-setup";
import { productsService } from "../../products/products.service";
import { cartsService } from "../../carts/carts.service";
import { ordersService } from "../orders.service";
import { authService } from "../../auth/auth.service";
import { verifyToken } from "../../../utils/common";

let user: any;
let token: string;

beforeEach(async () => {
  const db = await setupTestDb();
  (productsService as any).db = db;
  (cartsService as any).db = db;
  (ordersService as any).db = db;
  (authService as any).db = db;

  user = await authService.signup({ email: "orderuser@example.com", password: "Password@123", role: "admin" });
  token = user.accessToken;

});

const makeProductPayload = (overrides: Record<string, any> = {}) => ({
  name: `OrderTest-Product-${Math.random().toString(36).slice(2, 8)}`,
  description: "A product for order tests",
  price: "20.00",
  stock: 10,
  category: "test",
  brand: "testbrand",
  imageUrl: "http://example.test/product.jpg",
  ...overrides,
});

const makeCartPayload = (productId: number, quantity = 1, price=100) => ({
  productId,
  quantity,
  price
});

describe("Orders API Integration", () => {
  describe("create order", () => {
    it("creates an order from cart items via API", async () => {
      // create product
      const productRes = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${token}`)
        .send(makeProductPayload({ name: "Order Product 1" }));
      const productId = productRes.body.data.id;

      // add product to cart
      await request(app)
        .post("/api/v1/cart/items")
        .set("Authorization", `Bearer ${token}`)
        .send(makeCartPayload(productId, 2));


      const orderRes = await request(app).post("/api/v1/orders").set("Authorization", `Bearer ${token}`);
      expect(orderRes.status).toBe(200);
      expect(orderRes.body.data).toHaveProperty("id");

      // // check product stock decreased
      const updatedProduct = await request(app).get(`/api/v1/products/${productId}`).set("Authorization", `Bearer ${token}`);
      expect(updatedProduct.body.data.stock).toBe(8); // 10 - 2
    });

    it("fails when stock is insufficient", async () => {
      const productRes = await request(app)
        .post("/api/v1/products")
        .send(makeProductPayload({ name: "Low Stock Product", stock: 1 }));
      const productId = productRes.body.data.id;

      await request(app)
        .post("/api/v1/cart/items")
        .send(makeCartPayload(productId, 2)); // requesting more than stock

      const res = await request(app).post("/api/v1/orders");
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/stock/i);
    });
  });

  describe("get orders", () => {
    it("fetches all user orders", async () => {
      const res = await request(app).get("/api/v1/orders");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("fetches a specific order by id", async () => {
      // create product and order
      const productRes = await request(app)
        .post("/api/v1/products")
        .send(makeProductPayload({ name: "Order Fetch Product" }));
      const productId = productRes.body.data.id;

      await request(app).post("/api/v1/cart/items").send(makeCartPayload(productId, 1));
      const orderRes = await request(app).post("/api/v1/orders");
      const orderId = orderRes.body.data.id;

      const res = await request(app).get(`/api/v1/orders/${orderId}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id", orderId);
    });

    it("returns 404 for non-existent order", async () => {
      const res = await request(app).get("/api/v1/orders/999999");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe("order history", () => {
    it("fetches items of an order", async () => {
      const productRes = await request(app)
        .post("/api/v1/products")
        .send(makeProductPayload({ name: "Order History Product" }));
      const productId = productRes.body.data.id;

      await request(app).post("/api/v1/cart/items").send(makeCartPayload(productId, 3));
      const orderRes = await request(app).post("/api/v1/orders");
      const orderId = orderRes.body.data.id;

      const res = await request(app).get(`/api/v1/orders/history/${orderId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty("productId", productId);
      expect(res.body.data[0]).toHaveProperty("quantity", 3);
    });
  });
});
