import { NodeEnv, TrivySeverity } from '../enums/config.enum';

export type ServerConfig = {
  host: string;
  port: number;
};

export type RoutesConfig = {
  globalPrefix: string;
};

export type ApplicationConfig = {
  routes: RoutesConfig;
};

export type ScanWorkDirConfig = {
  basePath: string;
  prefix: string;
};

export type ScanConfig = {
  concurrency: number;
  severity: keyof typeof TrivySeverity;
  workDir: ScanWorkDirConfig;
};

export type TrivyConfig = {
  binaryPath: string;
  timeoutMs: number;
};

export type ToolsConfig = {
  trivy: TrivyConfig;
};

export type LimitsConfig = {
  maxReportSizeMb: number;
};

export type Config = {
  nodeEnv: keyof typeof NodeEnv;
  app: ApplicationConfig;
  server: ServerConfig;
  scan: ScanConfig;
  tools: ToolsConfig;
  limits: LimitsConfig;
};
