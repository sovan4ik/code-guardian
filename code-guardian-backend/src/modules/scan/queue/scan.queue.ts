export type JobHandler<T> = (job: T) => Promise<void>;

export type QueueOptions = {
  concurrency?: number; // default: 1
};

export class ScanQueue<T> {
  private readonly queue: T[] = [];
  private running = 0;
  private readonly concurrency: number;

  constructor(
    private readonly handler: JobHandler<T>,
    opts: QueueOptions = {},
  ) {
    this.concurrency = Math.max(1, opts.concurrency ?? 1);
  }

  push(job: T): void {
    this.queue.push(job);
    this.drain();
  }

  size(): number {
    return this.queue.length;
  }

  private drain(): void {
    while (this.running < this.concurrency && this.queue.length) {
      const job = this.queue.shift()!;
      this.running++;

      void this.handler(job)
        .catch(() => undefined)
        .finally(() => {
          this.running--;
          this.drain();
        });
    }
  }

  inFlight(): number {
    return this.running;
  }
}
