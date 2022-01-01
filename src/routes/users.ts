import express from "express";
import bcrypt from "bcrypt";
import { User, UserModel } from "../models/User";
import { body, query, validationResult } from "express-validator";
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from "../models/RegistrationVerificationToken";
import { HydratedDocument } from "mongoose";
import dotenv from "dotenv";
import { Response } from "express-serve-static-core";
import { addMinutes } from "date-fns";

dotenv.config();

const router = express.Router();

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

    let hashedPassword = "";

    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      const existingUser: HydratedDocument<User> = await UserModel.findOne({
        email,
      });
      if (existingUser) {
        if (existingUser.emailVerified) {
          return res.status(400).json({
            registration_status: "User already exists",
          });
        } else {
          await UserModel.findByIdAndDelete(existingUser.id);
        }
      }

      const datePlusFifteenMinutes = addMinutes(new Date(), 15);

      const registrationVerificationToken: RegistrationVerificationToken = {
        value: "test",
        expiryDate: datePlusFifteenMinutes,
      };

      const registrationVerificationTokenModel =
        new RegistrationVerificationTokenModel(registrationVerificationToken);
      const registrationVerificationTokenDocument =
        await registrationVerificationTokenModel.save();

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        registrationVerificationToken: registrationVerificationTokenDocument.id,
      });

      await newUser.save();
    } catch (err) {
      console.error(err);

      return registrationInternalServerError(res);
    }

    return res.json({ registration_status: "Awaiting e-mail verification" });
  }
);

router.get("/register/confirm", query("token").exists(), async (req, res) => {
  const { token } = req.query;

  const foundToken: HydratedDocument<RegistrationVerificationToken> =
    await RegistrationVerificationTokenModel.findOne({
      value: token,
    });

  if (!foundToken) {
    return res.status(400).json({
      registration_status: "Invalid token provided",
    });
  }

  const user: HydratedDocument<User> = await UserModel.findOne({
    registrationVerificationToken: foundToken.id,
  });
  if (foundToken.expiryDate.getTime() > new Date().getTime()) {
    user.emailVerified = true;
    await user.save();
    foundToken.expiryDate = new Date();
    await foundToken.save();
  } else {
    return res.status(400).json({
      registration_status: "E-mail verification has expired",
    });
  }

  if (!user) {
    return registrationInternalServerError(res);
  }

  return res.json({
    registration_status: "Registration successful",
  });
});

function registrationInternalServerError(res: Response) {
  res.status(500).json({
    registration_status: "Error occurred during registration",
  });
}

export { router as UsersRouter };
