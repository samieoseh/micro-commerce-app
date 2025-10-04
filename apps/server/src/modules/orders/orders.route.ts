// orders.route.ts
import { Router } from 'express';
import ordersController from './orders.controller';
import { requireAuth } from '../../middleware/auth';
import { orderIdValidation } from './orders.validation';

const router = Router();

router.use(requireAuth);

// Example route -> GET /api/v1/orders
router.get('/', ordersController.getOrders);
router.get('/:id', orderIdValidation, ordersController.getOrder);
router.post('/', ordersController.createOrder);
router.get('/history/:id', ordersController.getOrderHistory);

export default router;
