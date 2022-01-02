import { PasswordEncoderService } from "./PasswordEncoderService";
import { HydratedDocument } from "mongoose";
import { User, UserModel } from "../models/User";
import { RegistrationVerificationTokenService } from "./RegistrationVerificationTokenService";
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from "../models/RegistrationVerificationToken";
import { EmailService } from "./EmailService";

export enum RegistrationStatus {
  AWAITING_EMAIL_VERIFICATION,
  USER_ALREADY_EXISTS,
  INVALID_TOKEN,
  EMAIL_VERIFICATION_EXPIRED,
  FAILURE,
  SUCCESS,
}

export class RegistrationService {
  private static instance: RegistrationService;

  private passwordEncoderService: PasswordEncoderService;
  private registrationVerificationTokenService: RegistrationVerificationTokenService;
  private emailService: EmailService;

  private constructor() {
    this.passwordEncoderService = PasswordEncoderService.getInstance();
    this.registrationVerificationTokenService =
      RegistrationVerificationTokenService.getInstance();
    this.emailService = EmailService.getInstance();
  }

  public static getInstance(): RegistrationService {
    if (!RegistrationService.instance) {
      RegistrationService.instance = new RegistrationService();
    }

    return RegistrationService.instance;
  }

  public async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<RegistrationStatus> {
    const existingUser: HydratedDocument<User> = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return RegistrationStatus.USER_ALREADY_EXISTS;
      } else {
        // Delete non-verified users to prevent expiration blocks
        await UserModel.findByIdAndDelete(existingUser.id);
      }
    }

    const hashedPassword = await this.passwordEncoderService.encodePassword(
      password
    );

    const registrationVerificationTokenDocument =
      await this.registrationVerificationTokenService.generateAndPersistRegistrationVerificationToken();

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

    this.emailService.sendMail(
      email,
      "Registration Confirmation",
      `Please click the following link to verify your account: http://localhost:3000/users/register/confirm?token=${registrationVerificationTokenDocument.value}`
    );

    return RegistrationStatus.AWAITING_EMAIL_VERIFICATION;
  }

  public async confirmUserRegistration(
    token: string
  ): Promise<RegistrationStatus> {
    const foundToken: HydratedDocument<RegistrationVerificationToken> =
      await RegistrationVerificationTokenModel.findOne({
        value: token,
      });

    if (!foundToken) {
      return RegistrationStatus.INVALID_TOKEN;
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
      return RegistrationStatus.EMAIL_VERIFICATION_EXPIRED;
    }

    if (!user) {
      return RegistrationStatus.FAILURE;
    }

    return RegistrationStatus.SUCCESS;
  }
}
