import {Router} from 'express';
import {JenkinsDao} from '../../dao/JenkinsDao';
import {isLoggedIn} from '../../config/Auth';

export const jobsRoute = (router: Router, jenkinsDao: JenkinsDao) => {
  router.get('/', isLoggedIn, (req, res, _) => {
    jenkinsDao
        .getAllJobs()
        .then((jobs) => res.json(jobs))
        .catch((reason) => res.status(500).json({error: reason}));
  });
};
