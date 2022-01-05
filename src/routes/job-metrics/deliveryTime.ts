import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";
import { DeliveryTimeServiceMethod } from "../../services/jenkins/deliveryTime";

export const deliveryTimeRoute = (
  router: Router,
  jenkinsDao: JenkinsDao,
  getDeliveryTime: DeliveryTimeServiceMethod
) => {
  router.get("/:jobName/deliveryTime", (req, res, _) => {
    getDeliveryTime(jenkinsDao, req.params.jobName)
      .then((deliveryTime) => res.json(deliveryTime))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
