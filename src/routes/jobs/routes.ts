import express from 'express';
import dotenv from 'dotenv';
import {JenkinsDao} from '../../dao/JenkinsDao';
import {jobsRoute} from './jobs';
import {jobRoute} from './job';
import {buildRoute} from './build';

const router = express.Router();
dotenv.config();

const jenkinsDao = new JenkinsDao(
    process.env.JENKINS_SERVER_URL,
    process.env.JENKINS_SERVER_USERNAME,
    process.env.JENKINS_SERVER_PASSWORD,
);

jobsRoute(router, jenkinsDao);
jobRoute(router, jenkinsDao);
buildRoute(router, jenkinsDao);

export {router as JobsRouter};
