import { JenkinsDao } from "../../dao/JenkinsDao";
import { DeliveryTimeDto } from "../../dto/metrics/DeliveryTimeDto";

export type DeliveryTimeServiceMethod = (
  jenkinsDao: JenkinsDao,
  jobName: string
) => Promise<DeliveryTimeDto>;

export const getDeliveryTime: DeliveryTimeServiceMethod = async (
  jenkinsDao: JenkinsDao,
  jobName: string
): Promise<DeliveryTimeDto> => {
  const { lastSuccessfulBuild } = await jenkinsDao.getJob(jobName);

  if (!lastSuccessfulBuild) {
    return {
      delivery_time: "No successful builds",
    };
  }

  const { duration } = await jenkinsDao.getBuild(
    jobName,
    lastSuccessfulBuild.number
  );

  return {
    delivery_time: duration,
  };
};
