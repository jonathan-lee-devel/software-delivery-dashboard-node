import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { registerRoute } from "./register";
import { confirmRoute } from "./confirm";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { transporter } from "../../config/Mail";

dotenv.config();

const router = express.Router();

bcrypt.genSalt((err, salt) => {
  if (err) throw err;
  registerRoute(router, salt, transporter);
});
confirmRoute(router);
loginRoute(router);
logoutRoute(router);

export { router as UsersRouter };
