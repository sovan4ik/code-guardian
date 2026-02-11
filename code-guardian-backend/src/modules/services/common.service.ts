import { getHeapStatistics } from 'v8';
export class CommonService {
  constructor() {}

  getHealth() {
    return {
      status: 'ok',
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  getOsMemory() {
    const memory = process.memoryUsage();

    return {
      rssMB: Math.round(memory.rss / 1024 / 1024),
      heapUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
      maxOldSpaceMB: Math.round(
        getHeapStatistics().heap_size_limit / 1024 / 1024,
      ),
    };
  }
}
