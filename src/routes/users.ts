import express from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../model/User";
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * @api {POST} /users/register
 * @apiName Register new user
 * @apiPermission admin
 * @apiGroup user
 *
 * @apiParam {String} [name] name
 * @apiParam {String} [email] Email
 */
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

    const newUser = new UserModel({
      name,
      email,
      password: null,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser
      .save()
      .then((_) => {
        return res.json({
          registration_status: "Awaiting e-mail verification",
        });
      })
      .catch((err) => {
        console.error(err);
        return res.sendStatus(500);
      });
  }
);

export { router as UsersRouter };
