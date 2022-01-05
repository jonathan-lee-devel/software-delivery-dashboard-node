import { NextFunction, Request, Response } from "express-serve-static-core";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ message: "You must be logged in to view this resource" });
};
