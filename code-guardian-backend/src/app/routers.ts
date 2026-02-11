import { RouterModule } from './types/server.type';
import { scanRoutes } from '../modules/scan/routes';
import { commonRoutes } from '../modules/common/routes';

export const routers: RouterModule[] = [
  {
    routes: commonRoutes,
    options: { prefix: '' },
  },
  {
    routes: scanRoutes,
    options: { prefix: '/scan' },
  },
];
