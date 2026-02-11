import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  RouteOptions,
} from 'fastify';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

export type ApplicationInstance = FastifyInstance<
  HttpServer,
  IncomingMessage,
  ServerResponse
>;

export type PluginModule = {
  plugin: FastifyPluginCallback | FastifyPluginAsync;
  options?: FastifyPluginOptions;
};

export type RouterModule = {
  routes: RouteOptions[];
  options?: FastifyPluginOptions;
};

export type ApplicationConfig = {
  server: { host: string; port: number };
  routes?: { globalPrefix?: string };
};
