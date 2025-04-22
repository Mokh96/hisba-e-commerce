import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';


/**
 * Handles MySQL data too long constraint violations.
 *
 * This occurs when a value exceeds the defined maximum length for a column (e.g., a string longer than allowed).
 * Responds with HTTP 400 Bad Request and specifies the field that received the oversized value.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleDataTooLong(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  const field = extractDataTooLongField(exception.driverError.message);

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Data too long for column',
      path: request.url,
      type: 'db.data_too_long',
      errors: [
        {
          field,
          message: `The value for '${field}' is too long and exceeds the allowed limit.`,
        },
      ],
    }),
  );
}

/**
 * Extracts the field name from a DATA TOO LONG constraint error.
 */
export function extractDataTooLongField(message: string): string {
  const match = message.match(/Data too long for column '(.+?)'/);
  return match ? match[1] : 'unknown';
}