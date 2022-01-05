import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";

export const buildRoute = (router: Router, jenkinsDao: JenkinsDao) => {
  router.get("/:jobName/build/:buildNumber", (req, res, _) => {
    jenkinsDao
      .getBuild(req.params.jobName, parseInt(req.params.buildNumber))
      .then((buildWithDetails) => res.json(buildWithDetails))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
