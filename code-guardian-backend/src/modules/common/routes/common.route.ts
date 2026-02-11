import { RouteOptions } from 'fastify';
import { CommonService } from '../../services/common.service';
import CommonController from '../controllers/common.controller';

const service = new CommonService();
const controller = new CommonController(service);

export const commonRoutes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/health',
    handler: (req, rep) => controller.health(req, rep),
  },
  {
    method: 'GET',
    url: '/os',
    handler: (req, rep) => controller.getMemory(req, rep),
  },
];
