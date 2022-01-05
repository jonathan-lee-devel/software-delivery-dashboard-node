import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";

export const jobsRoute = (router: Router, jenkinsDao: JenkinsDao) => {
  router.get("/", (req, res, _) => {
    jenkinsDao
      .getAllJobs()
      .then((jobs) => res.json(jobs))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
