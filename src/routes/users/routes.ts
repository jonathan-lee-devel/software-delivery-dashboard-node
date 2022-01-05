import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { registerRoute } from "./register";
import { confirmRoute } from "./confirm";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { registerUser } from "../../services/registration/register";
import { confirmUserRegistration } from "../../services/registration/confirm";
import { sendMail } from "../../services/email/send";
import { transporter } from "../../config/Mail";
import { encodePassword } from "../../services/password/encode";
import bcrypt from "bcrypt";
import { generateRegistrationVerificationToken } from "../../services/registration-verification-token/generate";

dotenv.config();

const router = express.Router();

bcrypt.genSalt((err, salt) => {
  if (err) throw err;

  registerRoute(
    router,
    salt,
    encodePassword,
    generateRegistrationVerificationToken,
    transporter,
    sendMail,
    registerUser
  );
});
confirmRoute(router, confirmUserRegistration);
loginRoute(router, passport);
logoutRoute(router);

export { router as UsersRouter };
