import express from "express";

import { JenkinsService } from "../services/JenkinsService";

const router = express.Router();
const jenkinsService = JenkinsService.getInstance();

router.get("/:jobName/numberOfDeliveries", (req, res, _) => {
  jenkinsService
    .getNumberOfDeliveries(req.params.jobName)
    .then((numberOfDeliveries) => {
      res.json(numberOfDeliveries);
    });
});

router.get("/:jobName/restoreTime", (req, res, _) => {
  jenkinsService.getRestoreTime(req.params.jobName).then((restoreTime) => {
    res.json(restoreTime);
  });
});

router.get("/:jobName/deliveryTime", (req, res, _) => {
  jenkinsService.getDeliveryTime(req.params.jobName).then((deliveryTime) => {
    res.json(deliveryTime);
  });
});

router.get("/:jobName/failureSuccessRate", (req, res, _) => {
  jenkinsService
    .getFailureSuccessRate(req.params.jobName)
    .then((failureSuccessRate) => res.json(failureSuccessRate));
});

export { router as JobMetricsRouter };
