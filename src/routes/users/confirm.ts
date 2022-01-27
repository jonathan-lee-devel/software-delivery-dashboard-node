import {Router} from 'express';
import {query} from 'express-validator';
import {formatRegistrationResponse} from './helpers/format';
import {RegistrationStatus} from '../../services/registration/enum/status';
import {confirmUserRegistration} from '../../services/registration/confirm';

export const confirmRoute = (router: Router) => {
  router.get('/register/confirm', query('token').exists(), async (req, res) => {
    const {token} = req.query;
    if (!token) {
      // Strange behaviour with express-validator for query parameter
      return res.status(400).json({
        errors: [
          {
            value: token,
            msg: 'Query parameter \'token\' is required',
            param: 'token',
            location: 'query',
          },
        ],
      });
    }

    const registrationStatus = await confirmUserRegistration(token);

    switch (registrationStatus) {
      case RegistrationStatus.SUCCESS:
        return res.redirect(`${process.env.FRONT_END_URL}/login`);
      case RegistrationStatus.INVALID_TOKEN:
      case RegistrationStatus.EMAIL_VERIFICATION_EXPIRED:
        return formatRegistrationResponse(res, 400, registrationStatus);
      default:
        return formatRegistrationResponse(res, 500, registrationStatus);
    }
  });
};
