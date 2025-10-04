import { AddCartItemPayload, UpdateCartItemPayload } from "./types/cart";

// carts.service.ts
class CartsService {
  async createCart(userId: number) {
    return "carts service working!";
  }

  async getCart(userId: number) {
    return "carts service working!";
  }

  async deleteCart(userId: number) {
    return "carts service working!";
  }

  async addItem(userId: number, payload: AddCartItemPayload) {
    return "carts service working!";
  }

  async clearItems(userId: number) {
    return "carts service working!";
  }

  async getItems(userId: number) {
    return "carts service working!";
  }

  async updateItem(itemId: number, payload: UpdateCartItemPayload) {
    return "carts service working!";
  }

  async deleteItem(itemId: number) {
    return "carts service working!";
  }

  async getItem(itemId: number) {
    return "carts service working!";
  }
}

export default new CartsService();
