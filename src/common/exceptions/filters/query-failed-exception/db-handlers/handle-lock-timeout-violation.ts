import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

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
export function handleLockTimeoutViolation(exception: QueryFailedError, response: Response, request: Request) {
  const status = HttpStatus.REQUEST_TIMEOUT;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'The database operation timed out while waiting for a lock.',
      path: request.url,
      type: ErrorType.LockTimeOut,
    }),
  );
}

export function generateLockTimeoutViolationErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const status = HttpStatus.REQUEST_TIMEOUT;
  return createErrorResponse({
    statusCode: status,
    message: 'The database operation timed out while waiting for a lock.',
    type: ErrorType.LockTimeOut,
  });
}

export default generateLockTimeoutViolationErrorMsg;
