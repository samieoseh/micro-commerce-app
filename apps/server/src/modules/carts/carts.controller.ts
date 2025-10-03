// carts.controller.ts
import { Request, Response } from 'express';
import cartsService from './carts.service';

class CartsController {
  async example(req: Request, res: Response) {
    const result = await cartsService.example();
    res.json({ message: result });
  }
}

export default new CartsController();
