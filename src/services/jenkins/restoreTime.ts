import { JenkinsDao } from "../../dao/JenkinsDao";
import { RestoreTimeDto } from "../../dto/metrics/RestoreTimeDto";

export const getRestoreTime = async (
  jenkinsDao: JenkinsDao,
  jobName: string
): Promise<RestoreTimeDto> => {
  const job = await jenkinsDao.getJob(jobName);

  const lastFailedBuild = await jenkinsDao.getBuild(
    jobName,
    job.lastFailedBuild.number
  );

  if (!lastFailedBuild) {
    return {
      restore_time: "No failed builds",
    };
  }

  const buildPromises = [];
  for (let i = job.lastFailedBuild.number - 1; i > 0; i--) {
    buildPromises.push(jenkinsDao.getBuild(jobName, i));
  }
  const buildWithDetailsDtos = await Promise.all(buildPromises);
  let found = false;
  let previousSuccessfulBuildTimestamp = lastFailedBuild.timestamp;
  buildWithDetailsDtos.forEach((buildWithDetails) => {
    if (buildWithDetails.result === "SUCCESS") {
      found = true;
      previousSuccessfulBuildTimestamp = buildWithDetails.timestamp;
    }
  });

  return {
    restore_time: found
      ? lastFailedBuild.timestamp - previousSuccessfulBuildTimestamp
      : "No successful builds found",
  };
};
