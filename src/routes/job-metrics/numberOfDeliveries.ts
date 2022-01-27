import {Router} from 'express';
import {JenkinsDao} from '../../dao/JenkinsDao';
import {getNumberOfDeliveries} from '../../services/jenkins/numberOfDeliveries';
import {isLoggedIn} from '../../config/Auth';

export const numberOfDeliveriesRoute = (
    router: Router,
    jenkinsDao: JenkinsDao,
) => {
  router.get('/:jobName/numberOfDeliveries', isLoggedIn, (req, res, _) => {
    getNumberOfDeliveries(jenkinsDao, req.params.jobName)
        .then((numberOfDeliveries) => res.json(numberOfDeliveries))
        .catch((reason) => res.status(500).json({error: reason}));
  });
};
