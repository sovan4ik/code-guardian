import './env';
import fastify from 'fastify';
import { FastifyApplication } from './app/instance';
import { plugins } from './app/plugins';
import { routers } from './app/routers';
import _CONFIG from './config';

const application = new FastifyApplication(
  () =>
    fastify({
      // logger: true
    }),
  {
    server: { host: _CONFIG.server.host, port: _CONFIG.server.port },
    routes: { globalPrefix: _CONFIG.app.routes.globalPrefix },
  },
  plugins,
  routers,
);

(async () => {
  await application.initialize();

  console.log('Environment variables:', _CONFIG);
})();
