import bcrypt from 'bcrypt';

export const encodePassword = async (
    salt: string,
    password: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};
