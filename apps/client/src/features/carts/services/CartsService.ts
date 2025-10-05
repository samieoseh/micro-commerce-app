import { CARTS_ENDPOINTS } from "@/src/shared/constants";
import { basicApiClient, safeRequest } from "@/src/shared/services";
import {  CartItem, CartItemPayload } from "../types/cart";

export class CartsService {
    static async getAll() {
       try {
        const results = await safeRequest(() => basicApiClient.get<{data: {items: CartItem[], total: number}}>(
            CARTS_ENDPOINTS.GET_ALL_ITEMS,
        ))
        return results?.data
       } catch (error) {
            return {items: [], total: 0}
       }
    }

    static async addToCart(payload: CartItemPayload) {
       const results = await safeRequest(() => basicApiClient.post<{data: CartItem[]}>(
            CARTS_ENDPOINTS.ADD_TO_CART,
            payload
        ))
        return results?.data
    }

    static async updateItemInCart(itemId: number, payload: CartItemPayload) {
       const results = await safeRequest(() => basicApiClient.put<{data: CartItem[]}>(
            CARTS_ENDPOINTS.UPDATE_IN_CART(itemId),
            payload
        ))
        return results?.data
    }

    static async removeItemFromCart(itemId: number) {
         const results = await safeRequest(() => basicApiClient.delete<{data: CartItem[]}>(
            CARTS_ENDPOINTS.REMOVE_FROM_CART(itemId),
        ))
        return results?.data
    }

    static async checkout() {
       return await safeRequest(() =>basicApiClient.post<{message: string}>(
            CARTS_ENDPOINTS.CHECKOUT,
        ))
    }
}
