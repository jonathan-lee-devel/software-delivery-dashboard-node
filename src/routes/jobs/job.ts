import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";

export const jobRoute = (router: Router, jenkinsDao: JenkinsDao) => {
  router.get("/:jobName", (req, res, _) => {
    jenkinsDao
      .getJob(req.params.jobName)
      .then((job) => res.json(job))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
