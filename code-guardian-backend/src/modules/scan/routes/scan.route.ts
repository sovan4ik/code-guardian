import { FastifyRequest, RouteOptions } from 'fastify';
import ScanController from '../controllers/scan.controller';
import { CreateScan, GetScan } from '../interfaces/req.interface';
import { ScanService } from '../services/scan.service';
import { CliRunner } from '../../common/runners/cli.runner';
import { ScanWorker } from '../workers/scan.worker';
import { ScanQueue } from '../queue/scan.queue';

const cli = new CliRunner();
const scanService = new ScanService(({ scanId, repoUrl }) =>
  queue.push({ scanId, repoUrl }),
);
const worker = new ScanWorker(cli, scanService);
const queue = new ScanQueue(worker.run.bind(worker));
const controller = new ScanController(scanService);

export const scanRoutes: RouteOptions[] = [
  {
    method: 'POST',
    url: '/',
    handler: (req, rep) =>
      controller.createScan(<FastifyRequest<CreateScan>>req, rep),
  },
  {
    method: 'GET',
    url: '/:scanId',
    handler: (req, rep) =>
      controller.getScan(<FastifyRequest<GetScan>>req, rep),
  },
  {
    method: 'GET',
    url: '/queue',
    handler: (req, rep) =>
      controller.getQueue(<FastifyRequest<GetScan>>req, rep),
  },
];
