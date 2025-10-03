import { setupTestDb } from "../../../tests/db-setup";
import { ProductsService } from "../products.service";
import { ApiError } from "../../../utils/api-error";

describe("ProductsService", () => {
  let service: ProductsService;
  let db: any;

  beforeEach(async () => {
    db = await setupTestDb();
    service = new ProductsService(db);
  });

  const makePayload = (overrides: Record<string, any> = {}) => ({
    name: `Product-${Math.random().toString(36).slice(2, 8)}`,
    description: "A test product",
    price: "19.99",
    stock: 10,
    category: "electronics",
    brand: "acme",
    imageUrl: "http://example.test/img.jpg",
    ...overrides,
  });

  it("creates a product", async () => {
    const payload = makePayload({ name: "Product A" });
    const created = await service.createProduct(payload as any);

    expect(created).toHaveProperty("id");
    expect(created.name).toBe(payload.name);
    expect(created).toHaveProperty("price");
  });

  it("prevents duplicate product names", async () => {
    const payload = makePayload({ name: "Product B" });

    await service.createProduct(payload as any);

    await expect(service.createProduct(payload as any)).rejects.toThrow();
  });

  it("returns paginated list of products", async () => {
    // create 15 products
    for (let i = 0; i < 15; i++) {
      await service.createProduct(makePayload({ name: `P-${i}` }) as any);
    }

    const page1 = await service.getProducts(1, 10);
    expect(page1.products.length).toBe(10);
    expect(page1.pagination.total).toBeGreaterThanOrEqual(15);
    expect(page1.pagination.totalPages).toBeGreaterThanOrEqual(2);

    const page2 = await service.getProducts(2, 10);
    expect(page2.products.length).toBeGreaterThanOrEqual(5);
  });

  it("gets product by id", async () => {
    const payload = makePayload({ name: "Product A" });
    const created = await service.createProduct(payload as any);

    const fetched = await service.getProductById(created.id);
    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
    expect(fetched!.name).toBe(payload.name);
  });

  it("updates product successfully", async () => {
    const payload = makePayload({ name: "Product A", price: "5.00" });
    const created = await service.createProduct(payload as any);

    const updated = await service.updateProduct(created.id, { price: "25.50", stock: 3 });
    expect(updated).toBeDefined();
    expect(updated!.price).not.toBe(payload.price);
    expect(updated!.stock).toBe(3);
  });

  it("returns undefined when updating non-existent product", async () => {
    const updated = await service.updateProduct(9999999, { price: "1.00" });
    expect(updated).toBeUndefined();
  });

  it("deletes an existing product", async () => {
    const payload = makePayload({ name: "Product A" });
    const created = await service.createProduct(payload as any);

    await service.deleteProduct(created.id);

    const after = await service.getProductById(created.id);
    expect(after).toBeUndefined();
  });

  it("throws ApiError when deleting non-existent product", async () => {
    await expect(service.deleteProduct(987654321)).rejects.toThrow(ApiError);
  });

  describe("searchProducts (filters & edge cases)", () => {
    beforeEach(async () => {
      await service.createProduct(
        makePayload({ name: "Red Shoe", category: "footwear", brand: "brand-x", price: "29.99" }) as any
      );

      await service.createProduct(
        makePayload({ name: "Blue Shirt", category: "apparel", brand: "brand-y", price: "19.99" }) as any
      );

      await service.createProduct(
        makePayload({ name: "Cheap Cap", category: "accessories", brand: "brand-x", price: "9.99" }) as any
      );
    });

    it("searches by keyword (ilike) - case insensitive", async () => {
      const res = await service.searchProducts({ q: "shoe", page: 1, limit: 10 } as any);
      expect(res.products.length).toBe(1);
      expect(res.products[0].name).toMatch(/shoe/i);
    });

    it("filters by category", async () => {
      const res = await service.searchProducts({ category: "apparel", page: 1, limit: 10 } as any);
      expect(res.products.length).toBe(1);
      expect(res.products[0].category).toBe("apparel");
    });

    it("filters by brand", async () => {
      const res = await service.searchProducts({ brand: "brand-x", page: 1, limit: 10 } as any);
      expect(res.products.length).toBe(2);
    });

    it("filters by minPrice / maxPrice correctly", async () => {
      const above10 = await service.searchProducts({ minPrice: 10, page: 1, limit: 10 } as any);
      expect(above10.products.every(p => Number(p.price) >= 10)).toBeTruthy();

      const below20 = await service.searchProducts({ maxPrice: 20, page: 1, limit: 10 } as any);
      expect(below20.products.every(p => Number(p.price) <= 20)).toBeTruthy();
    });

    it("returns all products when no filters are provided (paginated)", async () => {
      const res = await service.searchProducts({ page: 1, limit: 10 } as any);
      expect(res.products.length).toBeGreaterThanOrEqual(3);
      expect(res.pagination.total).toBeGreaterThanOrEqual(3);
    });
  });
});

