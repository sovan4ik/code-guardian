import { Config } from './types/config.type';

import development from './env/development';
import production from './env/production';
import { NodeEnv } from './enums/config.enum';

const env = (process.env.NODE_ENV as NodeEnv) || NodeEnv.development;

const CONFIG_MAP: Record<NodeEnv, Config> = {
  [NodeEnv.development]: development,
  [NodeEnv.production]: production,
};

const _CONFIG = CONFIG_MAP[env];

if (!_CONFIG) {
  throw new Error('Config for the given NODE_ENV was not found');
}

export default _CONFIG;
