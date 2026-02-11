import { ScanApi } from "./scan";
import { SystemApi } from "./system";
import { ScanApiGql } from "./graphql/scan";

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";

const _API = {
  scan: new ScanApi(apiBase),
  system: new SystemApi(apiBase),
} as const;

const _GQL_API = {
  scan: new ScanApiGql(apiBase),
} as const;

export { _API, _GQL_API };
