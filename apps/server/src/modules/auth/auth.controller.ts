// auth.controller.ts
import { Request, Response } from 'express';
import authService from './auth.service';

class AuthController {
  async example(req: Request, res: Response) {
    const result = await authService.example();
    res.json({ message: result });
  }
}

export default new AuthController();
