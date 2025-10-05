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

    static async update(id: number, payload: CreateProductPayload) {
        const results = await safeRequest(() => basicApiClient.put<{data: Product}>(
            PRODUCTS_ENDPOINTS.UPDATE(id),
            payload,
        ))
        return results?.data
    }

    static async remove(id: number) {
        const results = await safeRequest(() => basicApiClient.delete<{message: string}>(
            PRODUCTS_ENDPOINTS.DELETE(id),
        ))
        return results?.data
    }
}
