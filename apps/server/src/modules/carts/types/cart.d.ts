export interface AddCartItemPayload {
    cartId: number;
    productId: number;
    quantity: number,
    price: string
}
export interface UpdateCartItemPayload {
    productId?: number;
    quantity?: number,
    price?: string
}

export interface Cart {
    userId: number
}