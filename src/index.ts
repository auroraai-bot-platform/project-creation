import { Handler} from 'aws-lambda';
import axios, { Method } from 'axios';

const endpoint = process.env.PROJECT_CREATE_ENDPOINT || '/api/projects';

export interface LambdaRequest {
  authToken: string;
  botfrontBaseUrl: string;
  projects: Project[];
}

interface Project {
  baseUrl: string;
  name: string;
  nameSpace: string;
  projectId: string;
}

interface Result {
  statusCode: number;
  body: string;
}

export const handler: Handler<LambdaRequest, Result> = async (event, context) => {

  console.log('Run version: ', process.env.VERSION);

  if (!event.botfrontBaseUrl) {
    return errorHandler('botfrontBaseUrl missing.', 400);
  }

  if (!event.projects) {
    return errorHandler('projectIds array undefined', 400);
  }

  try {
    const putPromises = event.projects.map((project) => {
      return axios.request({
        headers: { authorization: event.authToken},
        method: 'PUT',
        data: project,
        url: `${event.botfrontBaseUrl}${endpoint}`
      });
    });

    const results = await Promise.allSettled(putPromises);

    if (results.some((result) => result.status === 'rejected')) {
      console.log(JSON.stringify(results));
      return errorHandler(`Some promises were rejected: ${JSON.stringify(results)}`);
    }
  } catch (error) {
    return errorHandler(error);
  }

  return successHandler();
}


export function successHandler(data: string = ''): Result {
  return {
    statusCode: 200,
    body: data
  };
}

export function errorHandler(error: any, statusCode: number = 503, ): Result {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error })
  };
}
