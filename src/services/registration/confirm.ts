import { RegistrationStatus } from "./enum/status";
import { HydratedDocument } from "mongoose";
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenModel,
} from "../../models/RegistrationVerificationToken";
import { User, UserModel } from "../../models/User";

export const confirmUserRegistration = async (
  token: string
): Promise<RegistrationStatus> => {
  const foundToken: HydratedDocument<RegistrationVerificationToken> =
    await RegistrationVerificationTokenModel.findOne({ value: token });

  if (!foundToken) {
    return RegistrationStatus.INVALID_TOKEN;
  }

  const user: HydratedDocument<User> = await UserModel.findOne({
    registrationVerificationToken: foundToken.id,
  });

  if (!user) {
    return RegistrationStatus.FAILURE;
  }

  if (foundToken.expiryDate.getTime() > new Date().getTime()) {
    user.emailVerified = true;
    await user.save();
    foundToken.expiryDate = new Date();
    await foundToken.save();
    return RegistrationStatus.SUCCESS;
  }
  return RegistrationStatus.EMAIL_VERIFICATION_EXPIRED;
};
