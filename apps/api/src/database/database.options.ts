import type { DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity.js';
import { migrations } from './migrations/index.js';

/**
 * Connection settings shared by the running app and the TypeORM CLI,
 * so both always see the same entities and migrations.
 */
export function buildDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [User],
    migrations,
    // The schema changes only through migrations, never automatically.
    synchronize: false,
    // Extensions are enabled by migrations too, not silently on connect.
    installExtensions: false,
    // UUID primary keys default to gen_random_uuid(), built into
    // Postgres 13+, instead of uuid_generate_v4(), which needs an extension.
    uuidExtension: 'pgcrypto',
  };
}
