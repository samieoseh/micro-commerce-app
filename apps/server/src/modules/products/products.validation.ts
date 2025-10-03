
import { body, param, query } from "express-validator";
import { validate } from "../../middleware/validate";

export const createProductValidation = [
  body("name")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 2, max: 255 }).withMessage("Name must be between 2 and 255 characters"),

  body("description")
    .isString().withMessage("Description must be a string")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("price")
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("category")
    .isString().withMessage("Category must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Category must be between 2 and 100 characters"),

  body("imageUrl")
    .isString().withMessage("Image Url must be a string")
    .isLength({ min: 5, max: 255 }).withMessage("Image Url must be between 5 and 100 characters"),


  body("brand")
    .optional()
    .isString().withMessage("Brand must be a string")
    .isLength({ max: 100 }).withMessage("Brand must be at most 100 characters"),

    validate
];


export const updateProductValidation = [
  param("id").isInt().withMessage("Product ID must be an integer"),

  body("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .isLength({ min: 2, max: 255 }).withMessage("Name must be between 2 and 255 characters"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("category")
    .optional()
    .isString().withMessage("Category must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Category must be between 2 and 100 characters"),

  body("brand")
    .optional()
    .isString().withMessage("Brand must be a string")
    .isLength({ max: 100 }).withMessage("Brand must be at most 100 characters"),
    validate

];

export const getProductByIdValidation = [
    param("id").isInt().withMessage("Product ID must be an integer"),
    validate
];


export const deleteProductValidation = [
    param("id").isInt().withMessage("Product ID must be an integer"),
    validate
];


export const getProductsValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("price_min").optional().isFloat({ min: 0 }).withMessage("Minimum price must be >= 0"),
    query("price_max").optional().isFloat({ min: 0 }).withMessage("Maximum price must be >= 0"),
    query("in_stock").optional().isBoolean().withMessage("in_stock must be true or false"),
    query("category").optional().isString().withMessage("Category must be a string"),
    query("brand").optional().isString().withMessage("Brand must be a string"),
    query("sort_by").optional().isIn(["name", "price", "created_at"]).withMessage("Invalid sort_by field"),
    query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
    validate
];


export const searchProductsValidation = [
  query("q").isString().withMessage("Search query must be a string").isLength({ min: 2 }),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  validate,
];
