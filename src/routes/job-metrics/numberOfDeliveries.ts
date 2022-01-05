import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";
import { NumberOfDeliveriesServiceMethod } from "../../services/jenkins/numberOfDeliveries";

export const numberOfDeliveriesRoute = (
  router: Router,
  jenkinsDao: JenkinsDao,
  getNumberOfDeliveries: NumberOfDeliveriesServiceMethod
) => {
  router.get("/:jobName/numberOfDeliveries", (req, res, _) => {
    getNumberOfDeliveries(jenkinsDao, req.params.jobName)
      .then((numberOfDeliveries) => res.json(numberOfDeliveries))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
