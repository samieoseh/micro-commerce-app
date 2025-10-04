import { param } from "express-validator";
import { validate } from "../../middleware/validate";

export const orderIdValidation = [
  param("id")
    .exists().withMessage("Order ID is required")
    .isInt({ gt: 0 }).withMessage("Order ID must be a positive integer"),
  validate,
]