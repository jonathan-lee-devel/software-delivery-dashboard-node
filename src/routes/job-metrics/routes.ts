import express from "express";
import dotenv from "dotenv";
import { JenkinsDao } from "../../dao/JenkinsDao";
import { failureSuccessRateRoute } from "./failureSuccessRate";
import { deliveryTimeRoute } from "./deliveryTime";
import { restoreTimeRoute } from "./restoreTime";
import { numberOfDeliveriesRoute } from "./numberOfDeliveries";
import { getFailureSuccessRate } from "../../services/jenkins/failureSuccessRate";
import { getDeliveryTime } from "../../services/jenkins/deliveryTime";
import { getRestoreTime } from "../../services/jenkins/restoreTime";
import { getNumberOfDeliveries } from "../../services/jenkins/numberOfDeliveries";

dotenv.config();

const router = express.Router();
const jenkinsDao = new JenkinsDao(
  process.env.JENKINS_SERVER_URL,
  process.env.JENKINS_SERVER_USERNAME,
  process.env.JENKINS_SERVER_PASSWORD
);

failureSuccessRateRoute(router, jenkinsDao, getFailureSuccessRate);
deliveryTimeRoute(router, jenkinsDao, getDeliveryTime);
restoreTimeRoute(router, jenkinsDao, getRestoreTime);
numberOfDeliveriesRoute(router, jenkinsDao, getNumberOfDeliveries);

export { router as JobMetricsRouter };
