import { HttpClient } from "@/lib/http";
import { ScanStartResponse, ScanStatusResponse } from "@/types";

export class ScanApi extends HttpClient {
  startScan(repoUrl: string): Promise<ScanStartResponse> {
    return this.request<ScanStartResponse>({
      url: "/scan",
      method: "POST",
      data: { repoUrl },
    });
  }

  getScanStatus(scanId: string): Promise<ScanStatusResponse> {
    return this.request<ScanStatusResponse>({
      url: `/scan/${encodeURIComponent(scanId)}`,
      method: "GET",
    });
  }
}
