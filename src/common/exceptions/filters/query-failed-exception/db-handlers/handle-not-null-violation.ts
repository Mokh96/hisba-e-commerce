import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

/**
 * Handles cases where a NOT NULL constraint is violated (e.g., column cannot be null).
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
