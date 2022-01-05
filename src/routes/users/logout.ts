import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

export const logoutRoute = (router: Router) => {
  router.get("/logout", (req, res, _) => {
    req.logout();
    res.redirect(`${process.env.FRONT_END_URL}/login`);
  });
};
