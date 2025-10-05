import { PRODUCTS_ENDPOINTS } from "@/src/shared/constants";
import { basicApiClient, safeRequest } from "@/src/shared/services";
import { Product } from "../types/products";

export class ProductsService {
    static async getAll() {
       const results = await safeRequest(() => basicApiClient.get<{data:{products: Product[]}}>(
            PRODUCTS_ENDPOINTS.GET_ALL,
        ))
        return results?.data.products
    }
}