import { Response, Request } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * Handles SQL syntax parsing errors (ER_PARSE_ERROR).
 *
 * This occurs when the SQL query is malformed or has invalid syntax.
 * Responds with HTTP 400 Bad Request and includes a generic message.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object for context.
 */
export function handleSqlParseError(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Invalid SQL syntax. Please contact the backend team.',
      path: request.url,
      type: 'db.sql_syntax_error',
      errors: [
        {
          field: 'query',
          message: 'SQL parsing failed due to malformed syntax.',
        },
      ],
    }),
  );
}
