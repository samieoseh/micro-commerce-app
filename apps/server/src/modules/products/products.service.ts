import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from '../../db/schema';
import { db } from "../../db";
import { products } from "./schema/product.schema";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { ProductPayload, ProductUpdatePayload, SearchParams } from "./types/product";
import { ApiError } from "../../utils/api-error";

class ProductsService {
    constructor(private db: NodePgDatabase<schema.Schema> | PgliteDatabase<schema.Schema>) {}

    async getProducts(page: number, limit: number) {
      const offset = (page - 1) * limit;

      const data = await this.db
        .select()
        .from(products)
        .limit(limit)
        .offset(offset);



      // Total count
      const [countResult] = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(products)

      return {
        products: data,
        pagination: {
          page,
          limit,
          total: Number(countResult.count),
          totalPages: Math.ceil(Number(countResult.count) / limit),
        },
      };
    }

    async getProductById(id: number) {
      const [product] = await this.db.select().from(products).where(eq(products.id, id));
      return product;
    }

    async createProduct(product: ProductPayload) {
      const [newProduct] = await this.db.insert(products).values(product).returning();
      return newProduct;
    }
    
    async updateProduct(id: number, product: ProductUpdatePayload) {
      const [updatedProduct] = await this.db.update(products).set(product).where(eq(products.id, id)).returning()
      return updatedProduct;
    }

    async deleteProduct(id: number) {
      const product = await this.getProductById(id);

      if (!product) {
        throw new ApiError(404, "Product does not exist")
      }

      await this.db.delete(products).where(eq(products.id, id))
    }

    async searchProducts(params: SearchParams) {
      const { q, category, brand, minPrice, maxPrice, page, limit } = params;

      const conditions: any[] = [];

      if (q) {
        conditions.push(ilike(products.name, `%${q}%`));
      }

      if (category) {
        conditions.push(eq(products.category, category));
      }

      if (brand) {
        conditions.push(eq(products.brand, brand));
      }

      if (minPrice !== undefined) {
        conditions.push(gte(products.price, minPrice.toString()));
      }

      if (maxPrice !== undefined) {
        conditions.push(lte(products.price, maxPrice.toString()));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      // Pagination
      const offset = (page - 1) * limit;

      const data = await this.db
        .select()
        .from(products)
        .where(where)
        .limit(limit)
        .offset(offset);


      // Total count
      const [countResult] = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(where);

      return {
        products: data,
        pagination: {
          page,
          limit,
          total: Number(countResult.count),
          totalPages: Math.ceil(Number(countResult.count) / limit),
        },
      };
    }
}

const productsService= new ProductsService(db)
export  {productsService, ProductsService};
