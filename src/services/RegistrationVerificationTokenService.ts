import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from "../models/RegistrationVerificationToken";
import { addMinutes } from "date-fns";
import { randomBytes } from "crypto";
import { HydratedDocument } from "mongoose";

export class RegistrationVerificationTokenService {
  private static instance: RegistrationVerificationTokenService;
  private static readonly DEFAULT_EXPIRY_TIME_MINUTES = 15;

  private constructor() {
    return;
  }

  public static getInstance(): RegistrationVerificationTokenService {
    if (!RegistrationVerificationTokenService.instance) {
      RegistrationVerificationTokenService.instance =
        new RegistrationVerificationTokenService();
    }

    return RegistrationVerificationTokenService.instance;
  }

  public async generateAndPersistRegistrationVerificationToken(): Promise<
    HydratedDocument<RegistrationVerificationToken>
  > {
    const tokenValue = await randomBytes(48);

    const datePlusFifteenMinutes = addMinutes(
      new Date(),
      RegistrationVerificationTokenService.DEFAULT_EXPIRY_TIME_MINUTES
    );

    const registrationVerificationToken: RegistrationVerificationToken = {
      value: tokenValue.toString("hex"),
      expiryDate: datePlusFifteenMinutes,
      user: null,
    };

    const registrationVerificationTokenModel =
      new RegistrationVerificationTokenModel(registrationVerificationToken);
    return registrationVerificationTokenModel.save();
  }
}
