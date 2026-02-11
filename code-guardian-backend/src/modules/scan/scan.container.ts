import ScanController from './controllers/scan.controller';
import { ScanService } from './services/scan.service';
import { CliRunner } from '../common/runners/cli.runner';
import { ScanWorker } from './workers/scan.worker';
import { ScanQueue } from './queue/scan.queue';
import { ScanJob } from './types/scan.type';

export class ScanContainer {
  private static _instance: ScanContainer | null = null;

  static get instance(): ScanContainer {
    if (!this._instance) {
      this._instance = new ScanContainer();
    }
    return this._instance;
  }

  static get controller() {
    return this.instance.controller;
  }

  static get queue() {
    return this.instance.queue;
  }

  static get scanService() {
    return this.instance.scanService;
  }

  static get worker() {
    return this.instance.worker;
  }

  static get cli() {
    return this.instance.cli;
  }

  readonly cli: CliRunner;
  readonly queue: ScanQueue<ScanJob>;
  readonly worker: ScanWorker;
  readonly scanService: ScanService;
  readonly controller: ScanController;

  private constructor() {
    this.cli = new CliRunner();

    this.scanService = new ScanService((job: ScanJob) => {
      this.queue.push(job);
    });

    this.worker = new ScanWorker(this.cli, this.scanService);
    this.queue = new ScanQueue<ScanJob>(this.worker.run.bind(this.worker));
    this.controller = new ScanController(this.scanService);
  }
}
