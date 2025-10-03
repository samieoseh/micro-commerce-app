import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import logger from "../utils/logger";

interface PostgresError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}

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

  const pgErr: PostgresError = (err as any).cause || err;
  if (pgErr.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry: item already exists",
        details: null
      });
  }
  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
