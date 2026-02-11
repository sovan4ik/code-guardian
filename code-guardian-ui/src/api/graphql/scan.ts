import { GraphqlClient } from "@/lib/graphql";
import { ScanStartResponse, ScanStatusResponse } from "@/types";

type StartScanData = {
  startScan: {
    id: string;
    status: string;
  };
};

type StartScanVars = {
  input: { repoUrl: string };
};

type ScanData = {
  scan: ScanStatusResponse | null;
};

type ScanVars = {
  id: string;
};

export class ScanApiGql extends GraphqlClient {
  async startScan(repoUrl: string): Promise<ScanStartResponse> {
    const data = await this.request<StartScanData, StartScanVars>({
      operationName: "StartScan",
      query: `
        mutation StartScan($input: StartScanInput!) {
          startScan(input: $input) {
            id
            status
          }
        }
      `,
      variables: { input: { repoUrl } },
    });

    return {
      scanId: data.startScan.id,
      status: data.startScan.status as any,
    };
  }

  async getScanStatus(scanId: string): Promise<ScanStatusResponse> {
    const data = await this.request<ScanData, ScanVars>({
      operationName: "Scan",
      query: `
        query Scan($id: ID!) {
          scan(id: $id) {
            id
            status
            error
            criticalVulnerabilities {
              vulnerabilityId
              pkgName
              installedVersion
              fixedVersion
              title
              severity
              description
              primaryUrl
            }
          }
        }
      `,
      variables: { id: scanId },
    });

    if (!data.scan) {
      throw new Error("Scan not found");
    }

    return data.scan;
  }
}
