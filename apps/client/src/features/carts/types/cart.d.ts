export interface CartItemPayload {
    productId: number;
    quantity?: number;
    price: string;
}

export interface CartItem {
    "id": number,
    "cartId": number,
    "userId": number,
    "productId": number,
    "quantity": number,
    "price": string
}