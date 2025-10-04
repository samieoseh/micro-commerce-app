// orders.controller.ts
import { Request, Response } from 'express';
import {ordersService} from './orders.service';

class OrdersController {
  async getOrders(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await ordersService.getOrders(user.id);
    res.json({ data: result, success: true });
  }

  async getOrder(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await ordersService.getOrder(user.id, +req.params.id);
    res.json({ data: result, success: true });
  }

  async createOrder(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await ordersService.createOrder(user.id);
    res.json({ data: result, success: true });
  }

  async getOrderHistory(req: Request, res: Response) {
    const user = req.user as {id: number}
    const result = await ordersService.getOrderHistory(user.id, +req.params.id);
    res.json({ data: result, success: true });
  }
}

export default new OrdersController();
