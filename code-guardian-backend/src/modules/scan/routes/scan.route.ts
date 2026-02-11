import { FastifyRequest, RouteOptions } from 'fastify';
import { CreateScan, GetScan } from '../interfaces/req.interface';
import { ScanContainer } from '../scan.container';

const { controller } = ScanContainer;

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
