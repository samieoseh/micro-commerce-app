// carts.route.ts
import { Router } from 'express';
import cartsController from './carts.controller';
import { catchAsync } from '../../utils/catch-async';
import { requireAuth } from '../../middleware/auth';
import { addCartItemValidation, clearCartItemsValidation, createCartValidation, deleteCartItemValidation, deleteCartValidation, getCartItemValidation, getCartValidation, updateCartItemValidation } from './carts.validation';

const router = Router();

router.use(requireAuth);

// Example route -> GET /api/v1/carts
router.post('/:userId', createCartValidation, catchAsync(cartsController.createCart));
router.get('/:userId', getCartValidation, catchAsync(cartsController.getCart));
router.delete('/:userId', deleteCartValidation, catchAsync(cartsController.deleteCart));

router.post('/:userId/items', addCartItemValidation, catchAsync(cartsController.addItem));
router.delete('/:userId/items', clearCartItemsValidation, catchAsync(cartsController.clearItems));
router.get('/:userId/items', catchAsync(cartsController.getItems));

router.patch('/:userId/items/:itemId', updateCartItemValidation, catchAsync(cartsController.updateItem));
router.delete('/:userId/items/:itemId', deleteCartItemValidation, catchAsync(cartsController.deleteItem));
router.get('/:userId/items/:itemId', getCartItemValidation, catchAsync(cartsController.getItem));

export default router;
