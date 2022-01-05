import { Router } from "express";
import {
  RegistrationService,
  RegistrationStatus,
} from "../../services/RegistrationService";
import { query } from "express-validator";
import { formattedRegistrationStatusResponse } from "./helpers/format";

export const confirmRoute = (
  router: Router,
  registrationService: RegistrationService
) => {
  router.get("/register/confirm", query("token").exists(), async (req, res) => {
    const { token } = req.query;
    if (!token) {
      // Strange behaviour with express-validator for query parameter
      return res.status(400).json({
        errors: [
          {
            value: token,
            msg: "Query parameter 'token' is required",
            param: "token",
            location: "query",
          },
        ],
      });
    }

    const registrationStatus =
      await registrationService.confirmUserRegistration(token);

    switch (registrationStatus) {
      case RegistrationStatus.SUCCESS:
        return formattedRegistrationStatusResponse(
          res,
          200,
          registrationStatus
        );
      case RegistrationStatus.INVALID_TOKEN:
      case RegistrationStatus.EMAIL_VERIFICATION_EXPIRED:
        return formattedRegistrationStatusResponse(
          res,
          400,
          registrationStatus
        );
      default:
        return formattedRegistrationStatusResponse(
          res,
          500,
          registrationStatus
        );
    }
  });
};
