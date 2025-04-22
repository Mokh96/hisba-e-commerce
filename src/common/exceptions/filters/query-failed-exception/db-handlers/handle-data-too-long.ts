import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';


/**
 * Handles cases where a string or data exceeds the column's defined length.
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