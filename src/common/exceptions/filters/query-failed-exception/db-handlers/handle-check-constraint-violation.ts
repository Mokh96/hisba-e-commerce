import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';

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
  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Check constraint failed',
      path: request.url,
      type: ErrorType.CheckConstraintViolation,
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
