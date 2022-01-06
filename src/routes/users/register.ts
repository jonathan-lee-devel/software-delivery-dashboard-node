import { Router } from "express";
import { body, validationResult } from "express-validator";
import { formatRegistrationResponse } from "./helpers/format";
import { RegisterUserServiceMethod } from "../../services/registration/register";
import { RegistrationStatus } from "../../services/registration/enum/status";
import { SendMailServiceMethod } from "../../services/email/send";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EncodePasswordServiceMethod } from "../../services/password/encode";

export const registerRoute = (
  router: Router,
  salt: string,
  encodePassword: EncodePasswordServiceMethod,
  transporter: Transporter<SMTPTransport.SentMessageInfo>,
  sendMail: SendMailServiceMethod,
  registerUser: RegisterUserServiceMethod
) => {
  router.post(
    "/register",
    body("name").exists(),
    body("email", "Only valid Ericsson e-mail addresses are allowed")
      .exists()
      .isEmail()
      .custom((input) => {
        return input.toString().endsWith("@ericsson.com");
      }),
    body("password", "Passwords must match")
      .exists()
      .custom((input, { req }) => {
        return input === req.body.confirm_password;
      }),
    body("confirm_password", "Passwords must match")
      .exists()
      .custom((input, { req }) => {
        return input === req.body.password;
      }),
    async (req, res, _) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const hashedPassword = await encodePassword(salt, password);

      const registrationStatus = await registerUser(
        transporter,
        sendMail,
        name,
        email,
        hashedPassword
      );

      switch (registrationStatus) {
        case RegistrationStatus.AWAITING_EMAIL_VERIFICATION:
          return formatRegistrationResponse(res, 200, registrationStatus);
        case RegistrationStatus.USER_ALREADY_EXISTS:
          return formatRegistrationResponse(res, 409, registrationStatus);
        default:
          return formatRegistrationResponse(res, 500, registrationStatus);
      }
    }
  );
};
