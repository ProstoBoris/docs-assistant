import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';

/**
 * App-wide settings, shared by main.ts and the end-to-end tests
 * so that tests exercise the app exactly as it runs in production.
 */
export function configureApp(app: INestApplication): void {
  // Every route lives under /api, e.g. GET /api/health.
  app.setGlobalPrefix('api');

  // Validate request bodies, query strings and params against their DTO
  // classes: unknown fields are rejected, and values are converted to the
  // declared types.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Send every error in the same JSON shape.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Close the database connection cleanly when the process is stopped.
  app.enableShutdownHooks();
}
