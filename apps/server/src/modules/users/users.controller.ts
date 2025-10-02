// users.controller.ts
import { Request, Response } from 'express';
import usersService from './users.service';

class UsersController {
  async example(req: Request, res: Response) {
    const result = await usersService.example();
    res.json({ message: result });
  }
}

export default new UsersController();
