import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

/**
 * Handles MySQL unknown column errors.
 *
 * This occurs when a query refers to a column that doesn't exist in the database.
 * Responds with HTTP 400 Bad Request and includes the missing column name if possible.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleUnknownColumnError(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  const columnMatch = exception.message.match(/Unknown column '(.+?)'/);
  const field = columnMatch?.[1];

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'The request references a non-existent column.',
      path: request.url,
      type: 'db.unknown_column',
      errors: field
        ? [{ field, message: `Column '${field}' does not exist.` }]
        : [],
    }),
  );
}
