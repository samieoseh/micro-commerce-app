import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: number; role: string } | undefined;

    if (!user) {
        throw new ApiError(401, "Unauthorized")
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions" );
    }

    next();
  };
};