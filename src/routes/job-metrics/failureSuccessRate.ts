import { Router } from "express";
import { FailureSuccessRateServiceMethod } from "../../services/jenkins/failureSuccessRate";
import { JenkinsDao } from "../../dao/JenkinsDao";

export const failureSuccessRateRoute = (
  router: Router,
  jenkinsDao: JenkinsDao,
  getFailureSuccessRate: FailureSuccessRateServiceMethod
) => {
  router.get("/:jobName/failureSuccessRate", (req, res, _) => {
    getFailureSuccessRate(jenkinsDao, req.params.jobName)
      .then((failureSuccessRate) => res.json(failureSuccessRate))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
