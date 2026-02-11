import { NodeEnv, TrivySeverity } from '../enums/config.enum';
import { Config } from '../types/config.type';

const applicationProductionConfig: Config = {
  nodeEnv: NodeEnv.production,
  server: {
    host: process.env.APP_HOST,
    port: Number(process.env.APP_PORT),
  },
  app: {
    routes: {
      globalPrefix: process.env.APP_ROUTES_GLOBAL_PREFIX,
    },
  },
  scan: {
    concurrency: Number(process.env.SCAN_CONCURRENCY),
    workDir: {
      basePath: process.env.SCAN_WORKDIR_BASE,
      prefix: process.env.SCAN_WORKDIR_PREFIX,
    },
    severity: process.env.SCAN_SEVERITY ?? TrivySeverity.CRITICAL,
  },
  tools: {
    trivy: {
      binaryPath: process.env.TRIVY_BIN_PATH,
      timeoutMs: Number(process.env.TRIVY_TIMEOUT_MS),
    },
  },
  limits: {
    maxReportSizeMb: Number(process.env.SCAN_MAX_REPORT_MB),
  },
};

export default applicationProductionConfig;
