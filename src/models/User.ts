import {model, Schema} from 'mongoose';
import {RegistrationVerificationToken} from './RegistrationVerificationToken';
import {ObjectID} from 'bson';

export interface User {
  email: string;
  password: string;
  emailVerified: boolean;
  registrationVerificationToken: RegistrationVerificationToken;
}

const schema = new Schema<User>({
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
  registrationVerificationToken: {
    type: ObjectID,
    required: true,
    unique: true,
  },
});

export const UserModel = model<User>('User', schema);
