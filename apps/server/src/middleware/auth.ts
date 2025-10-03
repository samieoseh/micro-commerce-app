// middleware/auth.ts
import passport from "../config/passport";
import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate("jwt", { session: false }, (err: any, user: number) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: You must be logged in to access this resource",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};
