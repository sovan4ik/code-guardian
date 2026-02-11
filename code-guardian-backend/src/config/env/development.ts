import { NodeEnv, TrivySeverity } from '../enums/config.enum';
import { Config } from '../types/config.type';

const applicationDevelopmentConfig: Config = {
  nodeEnv: NodeEnv.development,
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
    concurrency: Number(process.env.SCAN_CONCURRENCY ?? 1),
    workDir: {
      basePath: process.env.SCAN_WORKDIR_BASE ?? '/tmp',
      prefix: 'code-guardian-',
    },
    severity: process.env.SCAN_SEVERITY ?? TrivySeverity.CRITICAL,
  },
  tools: {
    trivy: {
      binaryPath: process.env.TRIVY_BIN_PATH ?? 'trivy',
      timeoutMs: Number(process.env.TRIVY_TIMEOUT_MS ?? 10 * 60_000),
    },
  },
  limits: {
    maxReportSizeMb: Number(process.env.SCAN_MAX_REPORT_MB ?? 1024),
  },
} as const;

export default applicationDevelopmentConfig;
