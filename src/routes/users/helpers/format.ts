import { Response } from "express-serve-static-core";
import { RegistrationStatus } from "../../../services/registration/enum/status";

export const formattedRegistrationStatusResponse = (
  res: Response,
  httpStatus: number,
  registrationStatus: RegistrationStatus
) => {
  res
    .status(httpStatus)
    .json({ registration_status: RegistrationStatus[registrationStatus] });
};
