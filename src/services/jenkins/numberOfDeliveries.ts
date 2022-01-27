import {JenkinsDao} from '../../dao/JenkinsDao';
import {NumberOfDeliveriesDto} from '../../dto/metrics/NumberOfDeliveriesDto';

export const getNumberOfDeliveries = async (
    jenkinsDao: JenkinsDao,
    jobName: string,
): Promise<NumberOfDeliveriesDto> => {
  const {builds} = await jenkinsDao.getJob(jobName);

  return {
    number_of_deliveries: builds.length,
  };
};
