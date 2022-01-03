import request from "request";
import { JobDto } from "../dto/JobDto";
import { BuildWithDetailsDto } from "../dto/BuildWithDetailsDto";

/**
 * Jenkins data-access-object used to retrieve data from the Jenkins server via the REST API.
 */
class JenkinsDao {
  /**
   * @private URL for the Jenkins server which is to be connected to.
   */
  private readonly jenkinsServerUrl: string;

  /**
   * @private auth string used for basic authentication when connecting to the Jenkins server.
   */
  private readonly auth: string;

  /**
   * @param jenkinsServerUrl URL for the Jenkins server which is to be connected to
   * @param jenkinsServerUsername username to be used when authenticating with the Jenkins server
   * @param jenkinsServerPassword password to be used when authenticating with the Jenkins server
   */
  public constructor(
    jenkinsServerUrl: string,
    jenkinsServerUsername: string,
    jenkinsServerPassword: string
  ) {
    this.jenkinsServerUrl = jenkinsServerUrl;
    this.auth =
      "Basic " +
      Buffer.from(`${jenkinsServerUsername}:${jenkinsServerPassword}`).toString(
        "base64"
      );
  }

  /**
   * Returns all available jobs.
   *
   * @returns all available jobs provided in a data transfer object
   */
  public async getAllJobs(): Promise<JobDto[]> {
    return new Promise((resolve, reject) => {
      request(
        `${this.jenkinsServerUrl}/api/json`,
        {
          json: true,
          headers: { Authorization: this.auth },
        },
        (error, response, body) => {
          if (error) return console.error(error);
          console.log(
            `Retrieved all Jenkins jobs with status: ${response.statusCode}`
          );
          if (JenkinsDao.isHtmlResponse(body)) {
            reject(
              "Jenkins server returned an HTML response indicating no OK HTTP status response"
            );
          }
          resolve(body.jobs);
        }
      );
    });
  }

  /**
   * Returns the job specified by the provided name.
   *
   * @param jobName name of the job to be returned
   * @returns job information provided in a data transfer object
   */
  public async getJob(jobName: string): Promise<JobDto> {
    return new Promise((resolve, reject) => {
      request(
        `${this.jenkinsServerUrl}/job/${jobName}/api/json`,
        {
          json: true,
          headers: { Authorization: this.auth },
        },
        (error, response, body) => {
          if (error) return console.error(error);
          console.log(
            `Retrieved job [${jobName}] with status: ${response.statusCode}`
          );
          if (JenkinsDao.isHtmlResponse(body)) {
            reject(
              "Jenkins server returned an HTML response indicating no OK HTTP status response"
            );
          }
          resolve(body);
        }
      );
    });
  }

  /**
   * Retrieves the build specified by job name and build number.
   *
   * @param jobName name of the job for which data is to be retrieved
   * @param buildNumber number for the given build
   * @returns build information provided in a data transfer object
   */
  public async getBuild(
    jobName: string,
    buildNumber: number
  ): Promise<BuildWithDetailsDto> {
    return new Promise((resolve, reject) => {
      request(
        `${this.jenkinsServerUrl}/job/${jobName}/${buildNumber}/api/json`,
        {
          json: true,
          headers: { Authorization: this.auth },
        },
        (error, response, body) => {
          if (error) return console.error(error);
          console.log(
            `Retrieved build [${jobName}/${buildNumber}] with status: ${response.statusCode}`
          );
          if (JenkinsDao.isHtmlResponse(body)) {
            reject(
              "Jenkins server returned an HTML response indicating no OK HTTP status response"
            );
          }
          resolve(body);
        }
      );
    });
  }

  /**
   * Determines whether the provided HTTP response body is an HTML response.
   *
   * @param body HTTP response body to be checked
   * @returns boolean indicating whether the provided HTTP response body is an HTML response
   * @private used within the Jenkins data access object class only
   */
  private static isHtmlResponse(body: any): boolean {
    return String(body).startsWith("<!doctype html>");
  }
}

export { JenkinsDao };
