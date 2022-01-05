import bcrypt from "bcrypt";

export type EncodePasswordServiceMethod = (
  salt: string,
  password: string
) => Promise<string>;

export const encodePassword: EncodePasswordServiceMethod = async (
  salt: string,
  password: string
): Promise<string> => {
  return bcrypt.hash(password, salt);
};
