// carts.controller.ts
import { Request, Response } from 'express';
import { cartsService } from './carts.service';
import { AddCartItemPayload, UpdateCartItemPayload } from './types/cart';

class CartsController {
  async createCart(req: Request, res: Response) {
    const result = await cartsService.createCart(+req.params.userId);
    res.status(201).json({ data: result, success: true });
  }

  async getCart(req: Request, res: Response) {
    const result = await cartsService.getCart(+req.params.userId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    res.json({ data: result, success: true });
  }

  async deleteCart(req: Request, res: Response) {
    await cartsService.deleteCart(+req.params.userId);
    res.json({ message: "Cart deleted successfully" });
  }

  async addItem(req: Request, res: Response) {
    const payload: AddCartItemPayload = req.body;
    const result = await cartsService.addItem(+req.params.userId, payload);
    res.status(201).json({ data: result, success: true });
  }

   async clearItems(req: Request, res: Response) {
    await cartsService.clearItems(+req.params.userId);
    res.json({ message: "Cart successfully cleared" });
  }

   async getItems(req: Request, res: Response) {
    const result = await cartsService.getItems(+req.params.userId);
    res.json({ data: result, success: true });
  }

  async updateItem(req: Request, res: Response) {
    const payload: UpdateCartItemPayload = req.body;
    const result = await cartsService.updateItem(+req.params.itemId, payload);
    res.json({ data: result, success: true });
  }

  async deleteItem(req: Request, res: Response) {
    await cartsService.deleteItem(+req.params.itemId);
    res.json({ message: "Item deleted successfully", success: true });
  }

  async getItem(req: Request, res: Response) {
    const result = await cartsService.getItem(+req.params.itemId);
    res.json({ data: result, success: true });
  }
}

export default new CartsController();
