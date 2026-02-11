import { ScanJob } from '../types/scan.type';

export interface ScanWorker {
  enqueue(params: ScanJob): void;
}
