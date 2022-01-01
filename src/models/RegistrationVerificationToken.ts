import { model, Schema } from "mongoose";

export interface RegistrationVerificationToken {
  value: string;
  expiryDate: Date;
}

const schema = new Schema<RegistrationVerificationToken>({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  expiryDate: {
    type: Date,
    required: true,
    unique: false,
  },
});

export const RegistrationVerificationTokenModel =
  model<RegistrationVerificationToken>("RegistrationVerificationToken", schema);
