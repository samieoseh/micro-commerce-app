import { PRODUCTS_ENDPOINTS } from "@/src/shared/constants";
import { basicApiClient, safeRequest } from "@/src/shared/services";
import { Product, CreateProductPayload } from "../types/products";

export class ProductsService {
    static async getAll() {
       const results = await safeRequest(() => basicApiClient.get<{data:{products: Product[]}}>(
            PRODUCTS_ENDPOINTS.GET_ALL,
        ))
        return results?.data.products
    }

    static async create(payload: CreateProductPayload) {
        const results = await safeRequest(() => basicApiClient.post<{data: Product}>(
            PRODUCTS_ENDPOINTS.CREATE,
            payload,
        ))
        return results?.data
    }
}
