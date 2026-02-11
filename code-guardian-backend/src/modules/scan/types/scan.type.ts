export enum ScanStatus {
  Queued = 'Queued',
  Scanning = 'Scanning',
  Finished = 'Finished',
  Failed = 'Failed',
}

export type ScanStatusType = keyof typeof ScanStatus;

export type ScanJob = { scanId: string; repoUrl: string };

export type TrivyScanResultRaw = {
  Target: string;
  Class: string;
  Type?: string;
  Packages?: unknown[];
  Secrets?: unknown[];
  Vulnerabilities?: TrivyVulnerabilityRaw[];
};

export type TrivyVulnerabilityRaw = {
  VulnerabilityID: string;
  VendorIDs?: string[];
  PkgID?: string;
  PkgName?: string;
  PkgIdentifier?: {
    PURL?: string;
    UID?: string;
  };
  InstalledVersion?: string;
  FixedVersion?: string;
  Status?: 'fixed' | 'affected' | string;
  Severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  SeveritySource?: string;
  PrimaryURL?: string;
  DataSource?: {
    ID: string;
    Name: string;
    URL?: string;
  };
  Fingerprint?: string;
  Title?: string;
  Description?: string;
  CweIDs?: string[];
  VendorSeverity?: Record<string, number>;
  CVSS?: {
    [source: string]: {
      V2Vector?: string;
      V3Vector?: string;
      V2Score?: number;
      V3Score?: number;
    };
  };
  References?: string[];
  PublishedDate?: string;
  LastModifiedDate?: string;
};

export type Vulnerability = {
  vulnerabilityId: TrivyVulnerabilityRaw['VulnerabilityID'];
  pkgName: TrivyVulnerabilityRaw['PkgName'];
  installedVersion: TrivyVulnerabilityRaw['InstalledVersion'];
  fixedVersion: TrivyVulnerabilityRaw['FixedVersion'];
  title: TrivyVulnerabilityRaw['Title'];
  severity: TrivyVulnerabilityRaw['Severity'];
  description: TrivyVulnerabilityRaw['Description'];
  primaryUrl: TrivyVulnerabilityRaw['PrimaryURL'];
};

export type ScanRecord = {
  id: string;
  status: ScanStatus;
  repoUrl: string;
  criticalVulnerabilities: Vulnerability[];
  error?: string;
  createdAt: number;
  updatedAt: number;
};

export type CreateScanResponse = { scanId: string; status: ScanStatus };
export type GetScanResponse = ScanRecord | undefined;
