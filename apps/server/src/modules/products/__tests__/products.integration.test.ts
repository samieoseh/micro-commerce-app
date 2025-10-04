import request from "supertest";
import app from "../../../app";
import { setupTestDb } from "../../../tests/db-setup";
import { productsService } from "../products.service";

beforeEach(async () => {
  const db = await setupTestDb();
  (productsService as any).db = db;
});

const makePayload = (overrides: Record<string, any> = {}) => ({
  name: `API-Product-${Math.random().toString(36).slice(2, 8)}`,
  description: "A product created during tests",
  price: "12.50",
  stock: 4,
  category: "test-cat",
  brand: "test-brand",
  imageUrl: "http://example.test/product.jpg",
  ...overrides,
});

describe("Products API Integration", () => {
  describe("create product", () => {
    it("creates a product via API", async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .send(makePayload({ name: "API Unique Product 1" }));

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("name");
    });

    it("prevents duplicate names via API (409)", async () => {
      const payload = makePayload({ name: "API Duplicate Product" });

      await request(app).post("/api/v1/products").send(payload);

      const res = await request(app).post("/api/v1/products").send(payload);

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/exists|duplicate|unique/i);
    });

    it("rejects create with missing required fields (400)", async () => {
      // omit `name` which is required
      const { name, ...partial } = makePayload();
      const res = await request(app).post("/api/v1/products").send(partial);

      expect(res.status).toBe(400);
    });
  });

  describe("read / list", () => {
    it("returns paginated products", async () => {
      // create 12 products
      for (let i = 0; i < 12; i++) {
        await request(app).post("/api/v1/products").send(makePayload({ name: `List-P-${i}` }));
      }

      const res = await request(app).get("/api/v1/products?page=1&limit=10");
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(10);
      expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(12);
    });

    it("gets product by id", async () => {
      const create = await request(app).post("/api/v1/products").send(makePayload({ name: "GetById API" }));
      const id = create.body.data.id;

      const res = await request(app).get(`/api/v1/products/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id", id);
    });

    it("returns 404 for missing product by id", async () => {
      const res = await request(app).get("/api/v1/products/999999");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe("update / delete", () => {
    it("updates product via API", async () => {
      const create = await request(app).post("/api/v1/products").send(makePayload({ name: "API Update Product" }));
      const id = create.body.data.id;

      const res = await request(app)
        .put(`/api/v1/products/${id}`)
        .send({ price: "99.99", stock: 2 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("price");
      expect(Number(res.body.data.price)).toBeCloseTo(99.99);
    });

    it("returns 404 when updating non-existent product", async () => {
      const res = await request(app).put("/api/v1/products/999999").send({ price: "1.00" });
      expect(res.status).toBe(404);
    });

    it("deletes product via API", async () => {
      const create = await request(app).post("/api/v1/products").send(makePayload({ name: "API Delete Product" }));
      const id = create.body.data.id;

      const res = await request(app).delete(`/api/v1/products/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);

      // subsequent fetch should 404
      const after = await request(app).get(`/api/v1/products/${id}`);
      expect(after.status).toBe(404);
    });

    it("returns 404 when deleting non-existent product", async () => {
      const res = await request(app).delete(`/api/v1/products/999999`);
      expect(res.status).toBe(404);
    });
  });

  describe("search endpoint", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/products").send(makePayload({ name: "Search Shoe", category: "footwear", brand: "sco", price: "29.99" }));
      await request(app).post("/api/v1/products").send(makePayload({ name: "Search Shirt", category: "apparel", brand: "shirtco", price: "19.99" }));
      await request(app).post("/api/v1/products").send(makePayload({ name: "P Cap", category: "accessories", brand: "capco", price: "9.99" }));
    });

    it("searches by keyword and price filters via API", async () => {
      const res = await request(app).get("/api/v1/products/search/query?q=shoe&minPrice=10");
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.products[0].name).toMatch(/shoe/i);
    });
  });
});
