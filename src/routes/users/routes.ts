import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { RegistrationService } from "../../services/RegistrationService";
import { registerRoute } from "./register";
import { confirmRoute } from "./confirm";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";

dotenv.config();

const router = express.Router();

const registrationService = RegistrationService.getInstance();

registerRoute(router, registrationService);
confirmRoute(router, registrationService);
loginRoute(router, passport);
logoutRoute(router);

export { router as UsersRouter };
