import { randomUUID } from 'node:crypto';
import {
  CreateScanResponse,
  GetScanResponse,
  ScanJob,
  ScanRecord,
  ScanStatus,
  Vulnerability,
} from '../types/scan.type';

export class ScanService {
  private readonly scans = new Map<string, ScanRecord>();

  constructor(
    private readonly enqueue: (params: ScanJob) => void,
    private readonly queueInfo?: () => { size: number; inFlight: number },
  ) {}

  createScan(repoUrl: string): CreateScanResponse {
    const scanId = randomUUID();

    const record: ScanRecord = {
      id: scanId,
      repoUrl,
      status: ScanStatus.Queued,
      criticalVulnerabilities: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.scans.set(scanId, record);

    this.enqueue({ scanId, repoUrl });

    return { scanId, status: record.status };
  }

  getScan(id: string): GetScanResponse {
    const result = this.scans.get(id);
    return result;
  }

  getQueue(): { size: number; inFlight: number } | undefined {
    return this.queueInfo?.();
  }

  setStatus(id: string, status: ScanStatus): void {
    this.mutate(id, (record) => {
      record.status = status;
    });
  }

  setResult(id: string, criticalVulnerabilities: Vulnerability[]): void {
    this.mutate(id, (record) => {
      record.status = ScanStatus.Finished;
      record.criticalVulnerabilities = criticalVulnerabilities;
    });
  }

  setFailed(id: string, error: string): void {
    this.mutate(id, (record) => {
      record.status = ScanStatus.Failed;
      record.error = error;
      record.criticalVulnerabilities = [];
    });
  }

  private mutate(id: string, cb: (record: ScanRecord) => void): void {
    const record = this.scans.get(id);
    if (!record) return;

    cb(record);
    record.updatedAt = Date.now();
  }
}
