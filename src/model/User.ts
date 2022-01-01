import { model, Schema } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
}

const schema = new Schema<User>({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

export const UserModel = model<User>("User", schema);
