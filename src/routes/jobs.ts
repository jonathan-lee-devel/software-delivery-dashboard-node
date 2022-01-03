import express from "express";
import dotenv from "dotenv";

import { JenkinsDao } from "../dao/JenkinsDao";

const router = express.Router();

dotenv.config();
const jenkinsDao: JenkinsDao = new JenkinsDao(
  process.env.JENKINS_SERVER_URL,
  process.env.JENKINS_SERVER_USERNAME,
  process.env.JENKINS_SERVER_PASSWORD
);

router.get("/", (req, res, _) => {
  jenkinsDao.getAllJobs().then((jobs) => {
    res.json(jobs);
  });
});

router.get("/:jobName", (req, res, _) => {
  jenkinsDao.getJob(req.params.jobName).then((job) => {
    res.json(job);
  });
});

router.get("/:jobName/build/:buildNumber", (req, res, _) => {
  jenkinsDao
    .getBuild(req.params.jobName, parseInt(req.params.buildNumber, 10))
    .then((buildWithDetails) => {
      res.json(buildWithDetails);
    });
});

export { router as JobsRouter };
