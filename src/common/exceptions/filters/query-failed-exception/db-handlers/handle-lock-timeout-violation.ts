import { Response, Request } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * Handles MySQL lock wait timeout violations.
 *
 * This occurs when a transaction waits too long to acquire a lock due to contention.
 * Responds with HTTP 408 Request Timeout and indicates that the request timed out.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleLockTimeoutViolation(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  return response.status(HttpStatus.REQUEST_TIMEOUT).json(
    createErrorResponse({
      statusCode: HttpStatus.REQUEST_TIMEOUT,
      error: 'Request Timeout',
      message: 'The database operation timed out while waiting for a lock.',
      path: request.url,
      type: 'db.lock_wait_timeout',
    }),
  );
}
