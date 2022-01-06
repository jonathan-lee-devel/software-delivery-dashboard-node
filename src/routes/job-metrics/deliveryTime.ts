import { Router } from "express";
import { JenkinsDao } from "../../dao/JenkinsDao";
import { getDeliveryTime } from "../../services/jenkins/deliveryTime";

export const deliveryTimeRoute = (router: Router, jenkinsDao: JenkinsDao) => {
  router.get("/:jobName/deliveryTime", (req, res, _) => {
    getDeliveryTime(jenkinsDao, req.params.jobName)
      .then((deliveryTime) => res.json(deliveryTime))
      .catch((reason) => res.status(500).json({ error: reason }));
  });
};
