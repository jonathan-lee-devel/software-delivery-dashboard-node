import express from "express";
import bcrypt from "bcrypt";
import { User, UserModel } from "../model/User";
import { body, query, validationResult } from "express-validator";
import { RegistrationVerificationTokenModel } from "../model/RegistrationVerificationToken";
import dotenv from "dotenv";
import { HydratedDocument } from "mongoose";

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

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      });

      await newUser.save();
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        registration_status: "Error occurred during registration",
      });
    }

    return res.json({ registration_status: "Awaiting e-mail verification" });
  }
);

router.get("/register/confirm", query("token").exists(), async (req, res) => {
  const { token } = req.query;

  const foundToken = await RegistrationVerificationTokenModel.find({
    value: token,
  });

  const user = await UserModel.find({ foundToken });

  return res.json({ token });
});

export { router as UsersRouter };
