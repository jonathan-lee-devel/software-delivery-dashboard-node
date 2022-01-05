import { Response } from "express-serve-static-core";
import { RegistrationStatus } from "../../../services/RegistrationService";

export const formattedRegistrationStatusResponse = (
  res: Response,
  httpStatus: number,
  registrationStatus: RegistrationStatus
) => {
  res
    .status(httpStatus)
    .json({ registration_status: RegistrationStatus[registrationStatus] });
};
