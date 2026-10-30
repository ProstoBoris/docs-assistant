import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/** Shape of every error response the API sends. */
export type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
};

// Postgres error code for a unique constraint violation.
const UNIQUE_VIOLATION = '23505';

/**
 * Turns every exception into a consistent JSON error response, and makes
 * sure unexpected errors are logged without leaking details to clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // Exceptions thrown with a custom body, such as the health check's
    // report of which dependencies are down, are sent unchanged.
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'object' && !('message' in body)) {
        response.status(exception.getStatus()).json(body);
        return;
      }
    }

    const { statusCode, message } = this.describe(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorResponse = {
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Error',
      message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };
    response.status(statusCode).json(body);
  }

  private describe(exception: unknown): {
    statusCode: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : (body as { message: string | string[] }).message;
      return { statusCode: exception.getStatus(), message };
    }

    if (
      exception instanceof QueryFailedError &&
      (exception.driverError as { code?: string }).code === UNIQUE_VIOLATION
    ) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with these values already exists',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
