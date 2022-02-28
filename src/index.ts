import { Handler } from 'aws-lambda';
import axios from 'axios';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";


const endpoint = process.env.PROJECT_CREATE_ENDPOINT || '/api/projects';

export interface LambdaRequest {
  tokenSecretArn: string;
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
  StatusCode: number;
  body: string;
}

export const handler: Handler<LambdaRequest, Result> = async (event) => {
  console.log('Run version: ', process.env.VERSION);
  console.log({event: JSON.stringify(event)});
  return await createProjects(event);
}

export async function createProjects(projectData: LambdaRequest) {
  if (!projectData.botfrontBaseUrl) {
    return errorHandler('botfrontBaseUrl missing.', 400);
  }

  if (!projectData.projects) {
    return errorHandler('projectIds array undefined', 400);
  }

  const token = await getSecret(projectData.tokenSecretArn);
  const projects = projectData.projects.map((project) => {
    return {...project, token};
  });

  try {
    const putPromises = projects.map((project) => {
      return axios.request({
        method: 'PUT',
        data: project,
        url: `${projectData.botfrontBaseUrl}${endpoint}`
      });
    });

    const results = await Promise.allSettled(putPromises);

    if (results.some((result) => result.status === 'rejected')) {
      console.log(`Some promises were rejected: ${JSON.stringify(results)}`);
      throw new Error('`Some promises were rejected: ${JSON.stringify(results)}`');
    }
  } catch (error) {
    console.log({ error });
    throw error;
  }

  return successHandler();
}


function successHandler(data = ''): Result {
  return {
    StatusCode: 200,
    body: data
  };
}

function errorHandler(error: unknown, statusCode = 503, ): Result {
  console.log({error});
  return {
    StatusCode: statusCode,
    body: JSON.stringify({ error })
  };
}

async function getSecret(secretId: string): Promise<string> {
  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({SecretId: secretId});
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error('SecretString undefined');
  }
 
  return response.SecretString;
}