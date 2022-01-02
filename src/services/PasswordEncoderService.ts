import bcrypt from "bcrypt";

export class PasswordEncoderService {
  private static instance: PasswordEncoderService;

  private salt: string;

  private constructor() {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      this.salt = salt;
    });
  }

  public static getInstance(): PasswordEncoderService {
    if (!PasswordEncoderService.instance) {
      PasswordEncoderService.instance = new PasswordEncoderService();
    }

    return PasswordEncoderService.instance;
  }

  public async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
}
