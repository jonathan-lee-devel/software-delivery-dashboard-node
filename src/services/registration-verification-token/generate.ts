import { RegistrationVerificationToken } from "../../models/RegistrationVerificationToken";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";

export type GenerateRegistrationVerificationTokenServiceMethod = (
  tokenSize: number,
  expiryTimeMinutes: number
) => Promise<RegistrationVerificationToken>;

export const generateRegistrationVerificationToken: GenerateRegistrationVerificationTokenServiceMethod =
  async (
    tokenSize: number,
    expiryTimeMinutes: number
  ): Promise<RegistrationVerificationToken> => {
    return {
      value: randomBytes(tokenSize).toString("hex"),
      expiryDate: addMinutes(new Date(), expiryTimeMinutes),
      user: null,
    };
  };
