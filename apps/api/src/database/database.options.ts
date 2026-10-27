import type { DataSourceOptions } from 'typeorm';
import { migrations } from './migrations/index.js';

/**
 * Connection settings shared by the running app and the TypeORM CLI,
 * so both always see the same entities and migrations.
 */
export function buildDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [],
    migrations,
    // The schema changes only through migrations, never automatically.
    synchronize: false,
  };
}
