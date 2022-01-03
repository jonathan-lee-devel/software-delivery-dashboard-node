import { JenkinsDao } from "../JenkinsDao";
import dotenv from "dotenv";
dotenv.config();

let jenkinsDao: JenkinsDao;

beforeEach(() => {
  jenkinsDao = new JenkinsDao(
    process.env.JENKINS_SERVER_URL,
    process.env.JENKINS_SERVER_USERNAME,
    process.env.JENKINS_SERVER_PASSWORD
  );
});

describe("Jenkins DAO", () => {
  it("WHEN check DAO THEN not null", async () => {
    expect(jenkinsDao).not.toEqual(null);
  });

  it("WHEN get all jobs THEN not null", async () => {
    jenkinsDao.getAllJobs().then((jobs) => {
      expect(jobs).not.toEqual(null);
    });
  });

  it("WHEN get all jobs THEN correctly mapped to JobDto", async () => {
    jenkinsDao.getAllJobs().then((jobs) => {
      const job = jobs.pop();
      expect(job.name).not.toEqual(null);
      expect(job.builds).not.toEqual(null);
      expect(job.lastFailedBuild).not.toEqual(null);
      expect(job.lastSuccessfulBuild).not.toEqual(null);
    });
  });

  it("WHEN get existing job THEN correctly mapped to JobDto", async () => {
    const jobName = "Admin_DSL_PreCodeReview";
    jenkinsDao.getJob(jobName).then((job) => {
      expect(job.name).toEqual(jobName);
      expect(job.builds).not.toEqual(null);
      expect(job.lastFailedBuild).not.toEqual(null);
      expect(job.lastSuccessfulBuild).not.toEqual(null);
    });
  });

  it("WHEN get non-existent job THEN correctly catch error", async () => {
    jenkinsDao.getJob("NON-EXISTENT-JOB").catch((reason) => {
      expect(reason).not.toEqual(null);
    });
  });

  it("WHEN get existing build THEN correctly mapped to BuildWithDetailsDto", async () => {
    const jobName = "Admin_DSL_PreCodeReview";
    const buildNumber = 28;
    jenkinsDao.getBuild(jobName, buildNumber).then((buildWithDetails) => {
      expect(buildWithDetails.result).not.toEqual(null);
      expect(buildWithDetails.timestamp).not.toEqual(null);
      expect(buildWithDetails.duration).not.toEqual(null);
    });
  });

  it("WHEN get non-existing build THEN correctly catch error", async () => {
    jenkinsDao.getBuild("NON-EXISTENT-JOB", -1).catch((reason) => {
      expect(reason).not.toEqual(null);
    });
  });
});
