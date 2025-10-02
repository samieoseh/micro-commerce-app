import { Router } from 'express';
import usersRoutes from './users/users.route';
import authRoutes from './auth/auth.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
