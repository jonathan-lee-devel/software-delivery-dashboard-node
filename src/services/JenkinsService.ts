import { JenkinsDao } from "../dao/JenkinsDao";
import dotenv from "dotenv";
import { FailureSuccessRateDto } from "../dto/metrics/FailureSuccessRateDto";
import { RestoreTimeDto } from "../dto/metrics/RestoreTimeDto";
import { DeliveryTimeDto } from "../dto/metrics/DeliveryTimeDto";
import { NumberOfDeliveriesDto } from "../dto/metrics/NumberOfDeliveriesDto";

dotenv.config();

/**
 * Jenkins service used to calculate metrics based on Jenkins jobs.
 */
class JenkinsService {
  /**
   * @private JenkinsService singleton instance of Jenkins service.
   */
  private static instance: JenkinsService;

  /**
   * @private Jenkins data access object used to retrieve data on Jenkins jobs.
   */
  private jenkinsDao: JenkinsDao;

  /**
   * @private constructor used to enforce singleton design pattern, simply initializes Jenkins DAO.
   */
  private constructor() {
    this.jenkinsDao = new JenkinsDao(
      process.env.JENKINS_SERVER_URL,
      process.env.JENKINS_SERVER_USERNAME,
      process.env.JENKINS_SERVER_PASSWORD
    );
  }

  /**
   * Returns single instance of Jenkins service.
   */
  public static getInstance(): JenkinsService {
    if (!JenkinsService.instance) {
      JenkinsService.instance = new JenkinsService();
    }

    return JenkinsService.instance;
  }

  /**
   * Calculates the number of deliveries for a given job.
   */
  public async getNumberOfDeliveries(
    jobName: string
  ): Promise<NumberOfDeliveriesDto> {
    const { builds } = await this.jenkinsDao.getJob(jobName);

    // TODO examine behaviour upon null or undefined

    return {
      number_of_deliveries: builds.length,
    };
  }

  /**
   * Calculates the delivery time for a given job.
   */
  public async getDeliveryTime(jobName: string): Promise<DeliveryTimeDto> {
    const { lastSuccessfulBuild } = await this.jenkinsDao.getJob(jobName);

    if (!lastSuccessfulBuild) {
      return {
        delivery_time: "No successful builds",
      };
    }

    // TODO examine behaviour upon null or undefined
    const { duration } = await this.jenkinsDao.getBuild(
      jobName,
      lastSuccessfulBuild.number
    );

    return {
      delivery_time: duration,
    };
  }

  /**
   * Calculates the restore time for a given job.
   */
  public async getRestoreTime(jobName: string): Promise<RestoreTimeDto> {
    const job = await this.jenkinsDao.getJob(jobName);

    const lastFailedBuild = await this.jenkinsDao.getBuild(
      jobName,
      job.lastFailedBuild.number
    );
    if (!lastFailedBuild) {
      return {
        restore_time: "No failed builds",
      };
    }

    // TODO examine behaviour upon null or undefined
    const buildPromises = [];
    for (let i = job.lastFailedBuild.number - 1; i > 0; i--) {
      buildPromises.push(this.jenkinsDao.getBuild(jobName, i));
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
        : -1,
    };
  }

  public async getFailureSuccessRate(
    jobName: string
  ): Promise<FailureSuccessRateDto> {
    let successCount = 0;
    let failureCount = 0;

    const { builds } = await this.jenkinsDao.getJob(jobName);

    if (!builds || builds.length < 1) {
      return Promise.reject("No builds available");
    }

    // TODO examine behaviour upon null or undefined
    const buildPromises = [];
    for (let i = 1; i <= builds.length; i++) {
      buildPromises.push(this.jenkinsDao.getBuild(jobName, i));
    }
    const buildWithDetailsDtos = await Promise.all(buildPromises);
    buildWithDetailsDtos.forEach((buildWithDetails) => {
      if (buildWithDetails.result === "SUCCESS") {
        successCount++;
      } else if (buildWithDetails.result === "FAILURE") {
        failureCount++;
      }
    });

    return {
      failure_rate: (failureCount / builds.length) * 100.0,
      success_rate: (successCount / builds.length) * 100.0,
    };
  }
}

export { JenkinsService };
