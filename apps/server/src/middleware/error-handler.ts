import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error: %o", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null,
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
