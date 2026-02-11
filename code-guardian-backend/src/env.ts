import path from 'node:path';
import dotenv from 'dotenv';
import { NodeEnv } from './config/enums/config.enum';

const env = process.env.NODE_ENV || NodeEnv.development;

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
  override: true,
});
