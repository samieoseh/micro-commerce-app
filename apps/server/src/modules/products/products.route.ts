// products.route.ts
import { Router } from 'express';
import productsController from './products.controller';
import { catchAsync } from '../../utils/catch-async';
import { createProductValidation, deleteProductValidation, getProductByIdValidation, getProductsValidation, searchProductsValidation, updateProductValidation } from './products.validation';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';

const router = Router();

router.use(requireAuth)

// Example route -> GET /api/v1/products
router.post('/', createProductValidation, requireRole(['admin']), catchAsync(productsController.createProduct));
router.put('/:id',  updateProductValidation, requireRole(['admin']), catchAsync(productsController.updateProduct));
router.delete('/:id',  deleteProductValidation, requireRole(['admin']), catchAsync(productsController.deleteProduct));

router.get('/',  getProductsValidation, catchAsync(productsController.getProducts));
router.get('/search/query', getProductsValidation, catchAsync(productsController.searchProducts));
router.get('/:id', getProductByIdValidation,  catchAsync(productsController.getProductById));;

export default router;
