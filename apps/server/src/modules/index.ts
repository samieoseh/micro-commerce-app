import { Router } from 'express';
import productsRoutes from './products/products.route';
import usersRoutes from './users/users.route';
import authRoutes from './auth/auth.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);

export default router;
