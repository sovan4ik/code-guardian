import { RequestGenericInterface } from 'fastify';

export interface CreateScan extends RequestGenericInterface {
  Body: { repoUrl: string };
}

export interface GetScan extends RequestGenericInterface {
  Params: { scanId: string };
}
