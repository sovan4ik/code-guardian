import { RequestGenericInterface } from 'fastify';

export interface RequestGI extends RequestGenericInterface {
  Body: unknown;
  Querystring: unknown;
  Params: unknown;
  Headers: unknown;
}
