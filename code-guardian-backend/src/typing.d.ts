declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development';
      APP_HOST: string;
      APP_PORT: string;
      APP_ROUTES_GLOBAL_PREFIX: string;
      SCAN_CONCURRENCY: string;
      SCAN_WORKDIR_BASE: string;
      SCAN_WORKDIR_PREFIX: string;
      SCAN_SEVERITY: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      TRIVY_BIN_PATH: string;
      TRIVY_TIMEOUT_MS: string;
      SCAN_MAX_REPORT_MB: string;
    }
  }
}

export {};
