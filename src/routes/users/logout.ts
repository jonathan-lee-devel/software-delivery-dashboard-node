import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

export const logoutRoute = (router: Router) => {
  router.post("/logout", (req, res, _) => {
    req.logout();
    res.json({ logout_status: "SUCCESS" });
  });
};
