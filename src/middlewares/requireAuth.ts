import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../errors/AuthenticationError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new AuthenticationError("Not authorized");
  }

  next();
};
