// carts.controller.ts
import { Request, Response } from 'express';
import cartsService from './carts.service';

class CartsController {
  async createCart(req: Request, res: Response) {
    const result = await cartsService.createCart();
    res.json({ message: result });
  }

  async getCart(req: Request, res: Response) {
    const result = await cartsService.getCart();
    res.json({ message: result });
  }

  async deleteCart(req: Request, res: Response) {
    const result = await cartsService.deleteCart();
    res.json({ message: result });
  }

  async addItem(req: Request, res: Response) {
    const result = await cartsService.addItem();
    res.json({ message: result });
  }

   async clearItems(req: Request, res: Response) {
    const result = await cartsService.clearItems();
    res.json({ message: result });
  }

   async getItems(req: Request, res: Response) {
    const result = await cartsService.getItems();
    res.json({ message: result });
  }

  async updateItem(req: Request, res: Response) {
    const result = await cartsService.updateItem();
    res.json({ message: result });
  }

  async deleteItem(req: Request, res: Response) {
    const result = await cartsService.deleteItem();
    res.json({ message: result });
  }

  async getItem(req: Request, res: Response) {
    const result = await cartsService.getItem();
    res.json({ message: result });
  }
}

export default new CartsController();
