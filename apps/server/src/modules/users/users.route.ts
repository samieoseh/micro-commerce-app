// users.route.ts
import { Router } from 'express';
import usersController from './users.controller';

const router = Router();

// Example route -> GET /api/v1/users
router.get('/', (req, res) => usersController.example(req, res));

export default router;
