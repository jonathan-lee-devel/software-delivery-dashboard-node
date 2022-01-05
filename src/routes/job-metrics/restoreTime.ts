import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";
import { RestoreTimeServiceMethod } from "../../services/jenkins/restoreTime";

export const restoreTimeRoute = (
  router: Router,
  jenkinsDao: JenkinsDao,
  getRestoreTime: RestoreTimeServiceMethod
) => {
  router.get("/:jobName/restoreTime", (req, res, _) => {
    getRestoreTime(jenkinsDao, req.params.jobName)
      .then((restoreTime) => res.json(restoreTime))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
