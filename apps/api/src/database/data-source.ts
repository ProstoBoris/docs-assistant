import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { validateEnv } from '../config/env.schema.js';
import { buildDataSourceOptions } from './database.options.js';

// Used only by the TypeORM CLI (the migration:* scripts), not by the app.
const env = validateEnv(process.env);

export default new DataSource(buildDataSourceOptions(env.DATABASE_URL));
