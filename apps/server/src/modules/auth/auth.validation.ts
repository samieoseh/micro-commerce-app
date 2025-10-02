import { body } from "express-validator";
import { validate } from "../../middleware/validate";

export const signupValidation = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .exists().withMessage("New password is required")
      .isString().withMessage("New password must be a string")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
    validate,
]


export const loginValidation = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .exists().withMessage("New password is required")
      .isString().withMessage("New password must be a string")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
    validate, 
]

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  validate,
]

export const refreshValidation = [
  body("refreshToken")
    .exists().withMessage("Refresh token is required")
    .isString().withMessage("Refresh token must be a string")
    .notEmpty().withMessage("Refresh token cannot be empty"),
  validate, 
];

export const resetPasswordValidation = [
  body("token")
    .exists().withMessage("Reset token is required")
    .isString().withMessage("Reset token must be a string")
    .notEmpty().withMessage("Reset token cannot be empty"),

  body("newPassword")
    .exists().withMessage("New password is required")
    .isString().withMessage("New password must be a string")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),

  validate, // your centralized validation result handler
];