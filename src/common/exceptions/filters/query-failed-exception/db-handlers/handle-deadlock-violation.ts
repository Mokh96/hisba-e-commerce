import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { HttpStatus } from '@nestjs/common';

/**
 * Handles MySQL deadlock violations.
 *
 * This occurs when two or more transactions are waiting for each other to release locks, causing a deadlock.
 * Responds with HTTP 409 Conflict and suggests retrying the operation.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleDeadlockViolation(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  return response.status(HttpStatus.CONFLICT).json(
    createErrorResponse({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: 'A database deadlock occurred. Please retry the operation.',
      path: request.url,
      type: 'db.deadlock_detected',
    }),
  );
}