import { HydratedDocument } from "mongoose";
import { RegistrationStatus } from "./enum/status";
import { User, UserModel } from "../../models/User";
import { SendMailServiceMethod } from "../email/send";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { GenerateRegistrationVerificationTokenServiceMethod } from "../registration-verification-token/generate";
import { RegistrationVerificationTokenModel } from "../../models/RegistrationVerificationToken";
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from "../../config/Token";

export type RegisterUserServiceMethod = (
  generateRegistrationVerificationToken: GenerateRegistrationVerificationTokenServiceMethod,
  transporter: Transporter<SMTPTransport.SentMessageInfo>,
  sendMail: SendMailServiceMethod,
  name: string,
  email: string,
  hashedPassword: string
) => Promise<RegistrationStatus>;

export const registerUser: RegisterUserServiceMethod = async (
  generateRegistrationVerificationToken: GenerateRegistrationVerificationTokenServiceMethod,
  transporter: Transporter<SMTPTransport.SentMessageInfo>,
  sendMail: SendMailServiceMethod,
  name: string,
  email: string,
  hashedPassword: string
): Promise<RegistrationStatus> => {
  if (!(await handleExistingUser(email))) {
    return RegistrationStatus.USER_ALREADY_EXISTS;
  }

  const registrationVerificationTokenDocument =
    await new RegistrationVerificationTokenModel(
      await generateRegistrationVerificationToken(
        DEFAULT_TOKEN_SIZE,
        DEFAULT_EXPIRY_TIME_MINUTES
      )
    ).save();

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
    registrationVerificationToken: registrationVerificationTokenDocument.id,
  });

  await newUser.save();

  registrationVerificationTokenDocument.user = newUser;
  await registrationVerificationTokenDocument.save();

  sendMail(
    transporter,
    email,
    "Registration Confirmation",
    `Please click the following link to verify your account: http://localhost:3000/users/register/confirm?token=${registrationVerificationTokenDocument.value}`
  );

  return RegistrationStatus.AWAITING_EMAIL_VERIFICATION;
};

const handleExistingUser = async (email: string): Promise<boolean> => {
  const existingUser: HydratedDocument<User> = await UserModel.findOne({
    email,
  });

  if (existingUser) {
    if (existingUser.emailVerified) {
      return false;
    } else {
      await UserModel.findByIdAndDelete(existingUser.id);
    }
  }

  return true;
};
