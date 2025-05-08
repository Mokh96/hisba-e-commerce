import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

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
export function handleDeadlockViolation(exception: QueryFailedError, response: Response, request: Request) {
  const status = HttpStatus.CONFLICT;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'A database deadlock occurred. Please retry the operation.',
      path: request.url,
      type: ErrorType.DeadlockDetected,
    }),
  );
}

export function generateDeadlockViolationErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const status = HttpStatus.CONFLICT;

  return createErrorResponse({
    statusCode: status,
    message: 'A database deadlock occurred. Please retry the operation.',
    type: ErrorType.DeadlockDetected,
  });
}

export default generateDeadlockViolationErrorMsg;
