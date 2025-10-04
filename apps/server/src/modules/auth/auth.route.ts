// auth.route.ts
import { Router } from 'express';
import authController from './auth.controller';
import { forgotPasswordValidation, loginValidation, refreshValidation, resetPasswordValidation, signupValidation } from './auth.validation';
import { catchAsync } from '../../utils/catch-async';

const router = Router();

// Example route -> GET /api/v1/auth
router.post('/signup', signupValidation, catchAsync(authController.signup));
router.post('/admin/signup', signupValidation, catchAsync(authController.signupAdmin));
router.post('/login', loginValidation, catchAsync(authController.login));
router.post("/refresh", refreshValidation, catchAsync(authController.refresh))
router.post("/forgot-password", forgotPasswordValidation, catchAsync(authController.forgotPassword))
router.post("/reset-password", resetPasswordValidation,catchAsync(authController.resetPassword))

export default router;
