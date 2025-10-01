// auth.route.ts
import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

// Example route -> GET /api/v1/auth
router.get('/', (req, res) => authController.example(req, res));

export default router;
