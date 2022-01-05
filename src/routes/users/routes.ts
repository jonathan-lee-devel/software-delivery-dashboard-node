import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { registerRoute } from "./register";
import { confirmRoute } from "./confirm";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { registerUser } from "../../services/registration/register";
import { PasswordEncoderService } from "../../services/PasswordEncoderService";
import { RegistrationVerificationTokenService } from "../../services/RegistrationVerificationTokenService";
import { confirmUserRegistration } from "../../services/registration/confirm";
import { sendMail } from "../../services/email/send";
import { transporter } from "../../config/Mail";

dotenv.config();

const router = express.Router();

const passwordEncoderService = PasswordEncoderService.getInstance();
const registrationVerificationTokenService =
  RegistrationVerificationTokenService.getInstance();

registerRoute(
  router,
  passwordEncoderService,
  registrationVerificationTokenService,
  transporter,
  sendMail,
  registerUser
);
confirmRoute(router, confirmUserRegistration);
loginRoute(router, passport);
logoutRoute(router);

export { router as UsersRouter };
