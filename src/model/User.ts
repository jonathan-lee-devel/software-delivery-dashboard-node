import { model, Schema } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
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
});

export const UserModel = model<User>("User", schema);
