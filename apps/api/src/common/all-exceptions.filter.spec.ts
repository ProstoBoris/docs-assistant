import {
  BadRequestException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  type ArgumentsHost,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

function createHost() {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  const request = { method: 'GET', originalUrl: '/api/things/1' };
  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;
  return { host, response };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();

  it('formats an HTTP exception in the standard shape', () => {
    const { host, response } = createHost();

    filter.catch(new NotFoundException('Thing not found'), host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 404,
      error: 'Not Found',
      message: 'Thing not found',
      path: '/api/things/1',
      timestamp: expect.any(String),
    });
  });

  it('keeps the list of validation messages', () => {
    const { host, response } = createHost();

    filter.catch(
      new BadRequestException(['email must be an email', 'name is empty']),
      host,
    );

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: ['email must be an email', 'name is empty'],
      }),
    );
  });

  it('turns a unique constraint violation into 409 Conflict', () => {
    const { host, response } = createHost();
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505',
    });

    filter.catch(new QueryFailedError('INSERT ...', [], driverError), host);

    expect(response.status).toHaveBeenCalledWith(409);
  });

  it('hides the details of unexpected errors', () => {
    const { host, response } = createHost();
    const logError = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    filter.catch(new Error('connection string leaked here'), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' }),
    );
    expect(logError).toHaveBeenCalled();
  });

  it('sends a custom error body unchanged', () => {
    const { host, response } = createHost();
    const report = {
      status: 'error',
      details: { database: { status: 'down' } },
    };

    filter.catch(new ServiceUnavailableException(report), host);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith(report);
  });
});
