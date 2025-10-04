// carts.route.ts
import { Router } from 'express';
import cartsController from './carts.controller';
import { catchAsync } from '../../utils/catch-async';
import { requireAuth } from '../../middleware/auth';
import { addCartItemValidation, createCartValidation, deleteCartItemValidation, deleteCartValidation, getCartItemValidation, getCartValidation, updateCartItemValidation } from './carts.validation';

const router = Router();

router.use(requireAuth);

// Example route -> GET /api/v1/carts
router.post('/', createCartValidation, catchAsync(cartsController.createCart));
router.get('/', getCartValidation, catchAsync(cartsController.getCart));
router.delete('/', deleteCartValidation, catchAsync(cartsController.deleteCart));

router.post('/items', addCartItemValidation, catchAsync(cartsController.addItem));
router.delete('/items', catchAsync(cartsController.clearItems));
router.get('/items', catchAsync(cartsController.getItems));

router.put('/items/:itemId', updateCartItemValidation, catchAsync(cartsController.updateItem));
router.delete('/items/:itemId', deleteCartItemValidation, catchAsync(cartsController.deleteItem));
router.get('/items/:itemId', getCartItemValidation, catchAsync(cartsController.getItem));

export default router;
