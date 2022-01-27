import express from 'express';
import dotenv from 'dotenv';
import {JenkinsDao} from '../../dao/JenkinsDao';
import {failureSuccessRateRoute} from './failureSuccessRate';
import {deliveryTimeRoute} from './deliveryTime';
import {restoreTimeRoute} from './restoreTime';
import {numberOfDeliveriesRoute} from './numberOfDeliveries';

dotenv.config();

const router = express.Router();
const jenkinsDao = new JenkinsDao(
    process.env.JENKINS_SERVER_URL,
    process.env.JENKINS_SERVER_USERNAME,
    process.env.JENKINS_SERVER_PASSWORD,
);

failureSuccessRateRoute(router, jenkinsDao);
deliveryTimeRoute(router, jenkinsDao);
restoreTimeRoute(router, jenkinsDao);
numberOfDeliveriesRoute(router, jenkinsDao);

export {router as JobMetricsRouter};
