import {
  ApplicationConfig,
  ApplicationInstance,
  PluginModule,
  RouterModule,
} from './types/server.type';

export class FastifyApplication {
  private application!: ApplicationInstance;

  constructor(
    private readonly factory: () =>
      | Promise<ApplicationInstance>
      | ApplicationInstance,
    private readonly config: ApplicationConfig,
    private readonly plugins: PluginModule[] = [],
    private readonly routers: RouterModule[] = [],
  ) {}

  async initialize() {
    this.application = await this.factory();
    this.setup();
    await this.start();
  }

  private setup() {
    this.setGlobalPrefix();
    this.registerPlugins();
    this.registerRouters();
    this.registerErrorHandler();
  }

  private setGlobalPrefix() {
    const prefix = this.config.routes?.globalPrefix;
    if (!prefix) return;

    this.application.addHook('onRoute', (route) => {
      if (!route.url.startsWith(prefix)) route.url = `${prefix}${route.url}`;
    });
  }

  private registerPlugins() {
    for (const { plugin, options } of this.plugins) {
      this.application.register(plugin, options ?? {});
    }
  }
  private registerRouters() {
    for (const { routes, options } of this.routers) {
      this.application.register((scope, _opts, done) => {
        for (const route of routes) scope.route(route);
        done();
      }, options ?? {});
    }
  }

  private registerErrorHandler() {
    this.application.setErrorHandler((err, _req, rep) => {
      const statusCode = 500;
      rep.code(statusCode).send({
        statusCode,
        message: err instanceof Error ? err.message : 'Server error',
      });
    });
  }

  private async start() {
    const { port, host } = this.config.server;
    await this.application.listen({ port, host });
  }
}
