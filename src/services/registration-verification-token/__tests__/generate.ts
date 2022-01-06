import { generateRegistrationVerificationToken } from "../generate";
import {
  DEFAULT_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
} from "../../../config/Token";
import { RegistrationVerificationToken } from "../../../models/RegistrationVerificationToken";

let token: RegistrationVerificationToken;

beforeEach(async () => {
  token = await generateRegistrationVerificationToken(
    DEFAULT_TOKEN_SIZE,
    DEFAULT_EXPIRY_TIME_MINUTES
  );
});

describe("Registration Verification Token Service Generate", () => {
  it("WHEN generate token THEN not null except user", async () => {
    expect(token).not.toBeNull();
    expect(token.value).not.toBeNull();
    expect(token.expiryDate).not.toBeNull();
    expect(token.user).toBeNull(); // User should be initialized to null
  });

  it("WHEN generate token THEN value is of double length (hex)", async () => {
    expect(token.value).toHaveLength(DEFAULT_TOKEN_SIZE * 2);
  });

  it("WHEN generate token THEN token not expired", async () => {
    expect(token.expiryDate.getTime()).toBeGreaterThan(new Date().getTime());
  });
});
