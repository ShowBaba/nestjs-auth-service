import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from './src/config';

const ORMConfig: PostgresConnectionOptions = {
  type: 'postgres', 
  host: config.database.host,
  port: 5432, 
  username: config.database.username,
  password: config.database.password,
  database: config.database.db,
  entities: [
    join(__dirname, 'src', '**', 'database', 'entities', '**', '*{.ts,.js}'),
  ],
  synchronize: false,
  logging: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export default ORMConfig;
