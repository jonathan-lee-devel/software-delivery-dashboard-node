import {JenkinsDao} from '../../dao/JenkinsDao';
import {FailureSuccessRateDto} from '../../dto/metrics/FailureSuccessRateDto';

export const getFailureSuccessRate = async (
    jenkinsDao: JenkinsDao,
    jobName: string,
): Promise<FailureSuccessRateDto> => {
  const {builds} = await jenkinsDao.getJob(jobName);

  if (!builds || builds.length < 1) {
    return Promise.reject('No builds available');
  }

  const buildPromises = [];
  for (let i = 1; i <= builds.length; i++) {
    buildPromises.push(jenkinsDao.getBuild(jobName, i));
  }
  const buildWithDetailsDtos = await Promise.all(buildPromises);

  let successCount = 0;
  let failureCount = 0;
  buildWithDetailsDtos.forEach((buildWithDetails) => {
    if (buildWithDetails.result === 'SUCCESS') {
      successCount++;
    } else if (buildWithDetails.result === 'FAILURE') {
      failureCount++;
    }
  });

  return {
    failure_rate: (failureCount / builds.length) * 100.0,
    success_rate: (successCount / builds.length) * 100.0,
  };
};
