import request from 'request';
import {JobDto} from '../dto/JobDto';
import {BuildWithDetailsDto} from '../dto/BuildWithDetailsDto';

/**
 * Jenkins data-access-object used to retrieve data
 * from the Jenkins server via the REST API.
 */
class JenkinsDao {
  /**
     * @private URL for the Jenkins server which is to be connected to.
     */
  private readonly jenkinsServerUrl: string;

  /**
     * @private used for basic authentication.
     */
  private readonly auth: string;

  /**
     * @param {string} jenkinsServerUrl URL which is to be connected to
     * @param {string} jenkinsServerUsername to be used when authenticating
     * @param {string} jenkinsServerPassword to be used when authenticating
     */
  public constructor(
      jenkinsServerUrl: string,
      jenkinsServerUsername: string,
      jenkinsServerPassword: string,
  ) {
    this.jenkinsServerUrl = jenkinsServerUrl;
    this.auth =
            'Basic ' +
            Buffer.from(
                `${jenkinsServerUsername}:${jenkinsServerPassword}`)
                .toString('base64');
  }

  /**
     * Returns all available jobs.
     *
     * @return {Promise<JobDto[]>} all available jobs
     */
  public async getAllJobs(): Promise<JobDto[]> {
    return new Promise((resolve, reject) => {
      request(
          `${this.jenkinsServerUrl}/api/json`,
          {
            json: true,
            headers: {Authorization: this.auth},
          },
          (error, response, body) => {
            if (error) return console.error(error);
            console.log(
                `Retrieved all Jenkins jobs with status: 
                ${response.statusCode}`,
            );
            if (JenkinsDao.isHtmlResponse(body)) {
              reject(new Error(
                  'Jenkins server returned an HTML response ' +
                            'indicating no OK HTTP status response',
              ),
              );
            }
            resolve(body.jobs);
          },
      );
    });
  }

  /**
     * Returns the job specified by the provided name.
     *
     * @param {string} jobName name of the job to be returned
     * @return {Promise<JobDto>} job information provided in a DTO
     */
  public async getJob(jobName: string): Promise<JobDto> {
    return new Promise((resolve, reject) => {
      request(
          `${this.jenkinsServerUrl}/job/${jobName}/api/json`,
          {
            json: true,
            headers: {Authorization: this.auth},
          },
          (error, response, body) => {
            if (error) return console.error(error);
            console.log(
                `Retrieved job [${jobName}] with status: 
                ${response.statusCode}`,
            );
            if (JenkinsDao.isHtmlResponse(body)) {
              reject(new Error(
                  'Jenkins server returned an HTML response' +
                      ' indicating no OK HTTP status response',
              ),
              );
            }
            resolve(body);
          },
      );
    });
  }

  /**
     * Retrieves the build specified by job name and build number.
     *
     * @param {string} jobName name of the job for which data is to be retrieved
     * @param {number} buildNumber number for the given build
     * @return {Promise<BuildWithDetailsDto>} build information
     */
  public async getBuild(
      jobName: string,
      buildNumber: number,
  ): Promise<BuildWithDetailsDto> {
    return new Promise((resolve, reject) => {
      request(
          `${this.jenkinsServerUrl}/job/${jobName}/${buildNumber}/api/json`,
          {
            json: true,
            headers: {Authorization: this.auth},
          },
          (error, response, body) => {
            if (error) return console.error(error);
            console.log(
                `Retrieved build [
                ${jobName}/${buildNumber}
                ] with status: ${response.statusCode}`,
            );
            if (JenkinsDao.isHtmlResponse(body)) {
              reject(
                  new Error(
                      'Jenkins server returned an HTML response' +
                  ' indicating no OK HTTP status response',
                  ),
              );
            }
            resolve(body);
          },
      );
    });
  }

  /**
     * Determines whether the provided HTTP response body is an HTML response.
     *
     * @param {Response} body HTTP response body to be checked
     * @return {boolean} indicating whether the provided response body is HTML
     * @private used within the Jenkins data access object class only
     */
  private static isHtmlResponse(body: any): boolean {
    return String(body).startsWith('<!doctype html>');
  }
}

export {JenkinsDao};
