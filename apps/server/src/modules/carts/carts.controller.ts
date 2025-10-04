// carts.controller.ts
import { Request, Response } from 'express';
import { cartsService } from './carts.service';
import { AddCartItemPayload, UpdateCartItemPayload } from './types/cart';

class CartsController {
  async createCart(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await cartsService.createCart(user.id);
    res.status(201).json({ data: result, success: true });
  }

  async getCart(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await cartsService.getCart(user.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    res.json({ data: result, success: true });
  }

  async deleteCart(req: Request, res: Response) {
    const user = req.user as {id: number}
    await cartsService.deleteCart(user.id);
    res.json({ message: "Cart deleted successfully" });
  }

  async addItem(req: Request, res: Response) {
    const payload: AddCartItemPayload = req.body;
    const user = req.user as {id: number}

    const result = await cartsService.addItem(user.id, payload);
    res.status(201).json({ data: result, success: true });
  }

   async clearItems(req: Request, res: Response) {
    const user = req.user as {id: number}

    await cartsService.clearItems(user.id);
    res.json({ message: "Cart successfully cleared" });
  }

   async getItems(req: Request, res: Response) {
    const user = req.user as {id: number}

    const result = await cartsService.getItems(user.id);
    res.json({ data: result, success: true });
  }

  async updateItem(req: Request, res: Response) {
    const payload: UpdateCartItemPayload = req.body;
    const user = req.user as {id: number}
    const result = await cartsService.updateItem(user.id, +req.params.itemId, payload);
    res.json({ data: result, success: true });
  }

  async deleteItem(req: Request, res: Response) {
    const user = req.user as {id: number}
    await cartsService.deleteItem(user.id, +req.params.itemId);
    res.json({ message: "Item deleted successfully", success: true });
  }

  async getItem(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await cartsService.getItem(user.id, +req.params.itemId);
    res.json({ data: result, success: true });
  }
}

export default new CartsController();
