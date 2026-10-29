import type { INestApplication } from '@nestjs/common';

/**
 * App-wide settings, shared by main.ts and the end-to-end tests
 * so that tests exercise the app exactly as it runs in production.
 */
export function configureApp(app: INestApplication): void {
  // Every route lives under /api, e.g. GET /api/health.
  app.setGlobalPrefix('api');
  // Close the database connection cleanly when the process is stopped.
  app.enableShutdownHooks();
}
