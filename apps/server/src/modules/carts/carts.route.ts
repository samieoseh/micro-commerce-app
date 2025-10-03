// carts.route.ts
import { Router } from 'express';
import cartsController from './carts.controller';

const router = Router();

// Example route -> GET /api/v1/carts
router.get('/', (req, res) => cartsController.example(req, res));

export default router;
