import {Router} from 'express';
import {getFailureSuccessRate} from '../../services/jenkins/failureSuccessRate';
import {JenkinsDao} from '../../dao/JenkinsDao';
import {isLoggedIn} from '../../config/Auth';

export const failureSuccessRateRoute = (
    router: Router,
    jenkinsDao: JenkinsDao,
) => {
  router.get('/:jobName/failureSuccessRate', isLoggedIn, (req, res, _) => {
    getFailureSuccessRate(jenkinsDao, req.params.jobName)
        .then((failureSuccessRate) => res.json(failureSuccessRate))
        .catch((reason) => res.status(500).json({error: reason}));
  });
};
