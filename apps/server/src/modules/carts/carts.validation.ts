import { body, param } from "express-validator";
import { validate } from "../../middleware/validate";

export const createCartValidation = [
  body("userId")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
];

export const getCartValidation = [
  param("userId")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
];

export const deleteCartValidation = [
  param("userId")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
];

export const addCartItemValidation = [
    param("userId")
        .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
    body("productId")
        .isInt({ gt: 0 }).withMessage("productId must be a positive integer"),
    body("quantity")
        .optional()
        .isInt({ gt: 0 }).withMessage("quantity must be a positive integer"),
    body("price")
        .isDecimal({ decimal_digits: "0,2" }).withMessage("price must be a valid decimal with up to 2 decimal places"),
    validate
];

export const updateCartItemValidation = [
    param("userId")
        .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
    param("itemId")
        .isInt({ gt: 0 }).withMessage("itemId must be a positive integer"),
    body("quantity")
        .optional()
        .isInt({ gt: 0 }).withMessage("quantity must be a positive integer"),
    body("price")
        .optional()
        .isDecimal({ decimal_digits: "0,2" }).withMessage("price must be a valid decimal"),
    validate
];

export const deleteCartItemValidation = [
    param("userId")
        .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
    param("itemId")
        .isInt({ gt: 0 }).withMessage("itemId must be a positive integer"),
    validate
];

export const getCartItemValidation = [
    param("userId")
        .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
    param("itemId")
        .isInt({ gt: 0 }).withMessage("itemId must be a positive integer"),
    validate
];

export const clearCartItemsValidation = [
    param("userId")
        .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
    validate
];