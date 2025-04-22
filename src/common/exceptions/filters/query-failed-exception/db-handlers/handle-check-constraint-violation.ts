import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

/**
 * Handles MySQL CHECK constraint violations.
 *
 * This occurs when a value violates a condition defined using a CHECK constraint,
 * such as numeric limits or allowed value restrictions. Responds with HTTP 400 Bad Request.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleCheckConstraintViolation(exception: QueryFailedError, response: Response, request: Request) {
  const fallbackField = extractFieldFromCheckMessage(exception.driverError.message); // fallback if no specific field is parsed

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Check constraint failed',
      path: request.url,
      type: 'db.check_constraint_violation',
      errors: [
        {
          field: fallbackField,
          message: exception.message,
        },
      ],
    }),
  );
}

function extractFieldFromCheckMessage(message: string): string {
  const match = message.match(/Column '(.+?)'/);
  return match?.[1] ?? 'unknown';
}
