export type ScanStatus = "Queued" | "Scanning" | "Finished" | "Failed";

export enum ApiMode {
  REST = "REST",
  GQL = "GQL",
}

export interface Vulnerability {
  vulnerabilityId?: string;
  title?: string;
  pkgName?: string;
  installedVersion?: string;
  fixedVersion?: string;
  severity: string;
  description?: string;
  primaryUrl?: string;
}

export interface ScanStartResponse {
  scanId: string;
  status: ScanStatus;
}

export interface ScanStatusResponse {
  scanId: string;
  status: ScanStatus;
  criticalVulnerabilities?: Vulnerability[];
  error?: string;
}

export type MemoryStatus = {
  rssMB: number;
  heapUsedMB: number;
  maxOldSpaceMB: number;
};
