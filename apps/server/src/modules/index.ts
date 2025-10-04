import { Router } from 'express';
import cartsRoutes from './carts/carts.route';
import productsRoutes from './products/products.route';
import usersRoutes from './users/users.route';
import authRoutes from './auth/auth.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartsRoutes);

export default router;
