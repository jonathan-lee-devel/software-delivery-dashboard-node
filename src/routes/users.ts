import express from "express";
import { body, query, validationResult } from "express-validator";
import dotenv from "dotenv";
import passport from "passport";
import {
  RegistrationService,
  RegistrationStatus,
} from "../services/RegistrationService";
import { Response } from "express-serve-static-core";

dotenv.config();

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.status(200).json({ status: "success" });
});

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const registrationStatus =
      await RegistrationService.getInstance().registerUser(
        name,
        email,
        password
      );
    switch (registrationStatus) {
      case RegistrationStatus.AWAITING_EMAIL_VERIFICATION:
        return formattedRegistrationStatusResponse(
          res,
          200,
          registrationStatus
        );
      case RegistrationStatus.USER_ALREADY_EXISTS:
        return formattedRegistrationStatusResponse(
          res,
          409,
          registrationStatus
        );
      default:
        return formattedRegistrationStatusResponse(
          res,
          500,
          registrationStatus
        );
    }
  }
);

router.get("/register/confirm", query("token").exists(), async (req, res) => {
  const { token } = req.query;
  if (!token) {
    // Strange behaviour with express-validator for query parameter
    return res.status(400).json({
      errors: [
        {
          value: token,
          msg: "Query parameter 'token' is required",
          param: "token",
          location: "query",
        },
      ],
    });
  }

  const registrationStatus =
    await RegistrationService.getInstance().confirmUserRegistration(token);

  switch (registrationStatus) {
    case RegistrationStatus.SUCCESS:
      return formattedRegistrationStatusResponse(res, 200, registrationStatus);
    case RegistrationStatus.INVALID_TOKEN:
    case RegistrationStatus.EMAIL_VERIFICATION_EXPIRED:
      return formattedRegistrationStatusResponse(res, 400, registrationStatus);
    default:
      return formattedRegistrationStatusResponse(res, 500, registrationStatus);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, _) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // 200 status to avoid error callback within angular POST request subscription
      return res.status(401).json({ login_status: "FAILURE" });
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.status(200).json({ login_status: "SUCCESS" });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, _) => {
  req.logout();
  res.redirect("/users/login");
});

function formattedRegistrationStatusResponse(
  res: Response,
  httpStatus: number,
  registrationStatus: RegistrationStatus
) {
  res
    .status(httpStatus)
    .json({ registration_status: RegistrationStatus[registrationStatus] });
}

export { router as UsersRouter };
