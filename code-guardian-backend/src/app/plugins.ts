import { graphqlPlugin } from './plugins/graphql.plugin';
import { PluginModule } from './types/server.type';
import cors from '@fastify/cors';

export const plugins: PluginModule[] = [
  {
    plugin: cors,
    options: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    },
  },
  { plugin: graphqlPlugin },
];
