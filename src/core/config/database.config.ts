import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG_KEY = 'database';

const databaseConfig = registerAs(DATABASE_CONFIG_KEY, () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  type: process.env.DATABASE_TYPE ,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: process.env.AUTO_LOAD_ENTITIES === 'true',
  synchronize: process.env.SYNCHRONIZE === 'true',
}));

export default databaseConfig;
