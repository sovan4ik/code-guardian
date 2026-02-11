import { ScanApi } from "./scan";
import { SystemApi } from "./system";

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";

const _API = {
  scan: new ScanApi(apiBase),
  system: new SystemApi(apiBase),
} as const;

export { _API };
