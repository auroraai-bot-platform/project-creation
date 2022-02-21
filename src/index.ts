import { Handler } from 'aws-lambda';
import axios from 'axios';

const endpoint = process.env.PROJECT_CREATE_ENDPOINT || '/api/projects';

export interface LambdaRequest {
  botfrontBaseUrl: string;
  projects: Project[];
}

interface Project {
  baseUrl: string;
  name: string;
  nameSpace: string;
  projectId: string;
  host: string;
  token?: string;
  actionEndpoint: string;
  prodBaseUrl?: string;
  prodActionEndpoint?: string;
  hasProd?: boolean;
}

interface Result {
  statusCode: number;
  body: string;
}

export const handler: Handler<LambdaRequest, Result> = async (event) => {
  console.log('Run version: ', process.env.VERSION);
  return await createProjects(event);
}

export async function createProjects(projectData: LambdaRequest) {
  if (!projectData.botfrontBaseUrl) {
    return errorHandler('botfrontBaseUrl missing.', 400);
  }

  if (!projectData.projects) {
    return errorHandler('projectIds array undefined', 400);
  }

  try {
    const putPromises = projectData.projects.map((project) => {
      return axios.request({
        method: 'PUT',
        data: project,
        url: `${projectData.botfrontBaseUrl}${endpoint}`
      });
    });

    const results = await Promise.allSettled(putPromises);

    if (results.some((result) => result.status === 'rejected')) {
      return errorHandler(`Some promises were rejected: ${JSON.stringify(results)}`);
    }
  } catch (error) {
    return errorHandler(error);
  }

  return successHandler();
}


function successHandler(data = ''): Result {
  return {
    statusCode: 200,
    body: data
  };
}

function errorHandler(error: unknown, statusCode = 503, ): Result {
  console.log({error});
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error })
  };
}
