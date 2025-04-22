import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

/**
 * Handles MySQL NOT NULL constraint violations.
 *
 * This occurs when inserting or updating a record with a NULL value in a column defined as NOT NULL.
 * Responds with HTTP 400 Bad Request and includes the field that violated the NOT NULL constraint.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleNotNullViolation(exception: QueryFailedError, response: Response, request: Request) {
  const field = extractNotNullField(exception.driverError.message);

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Not-null constraint failed',
      path: request.url,
      type: 'db.not_null_violation',
      errors: [
        {
          field,
          message: `The field '${field}' is required and cannot be null.`,
        },
      ],
    }),
  );
}

/**
 * Extracts the field name from a NOT NULL constraint error.
 */
export function extractNotNullField(message: string): string {
  const match = message.match(/Column '(.+?)' cannot be null/);
  return match ? match[1] : 'unknown';
}
