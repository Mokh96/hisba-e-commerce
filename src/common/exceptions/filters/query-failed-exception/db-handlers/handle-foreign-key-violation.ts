import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { QueryFailedError } from 'typeorm';
import { extractForeignKeyInfo } from 'src/common/exceptions/filters/query-failed-exception/query-failed-exception.filter';
import { Request } from 'express';

/**
 * Handles MySQL foreign key constraint violations.
 *
 * This occurs when attempting to insert or update a record with a foreign key
 * value that does not match any existing record in the referenced table.
 * Responds with HTTP 400 Bad Request and includes the invalid field in the response body.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleForeignKeyViolation(exception: QueryFailedError, response: Response, request: Request) {
  const driverError = exception.driverError;
  const { field } = extractForeignKeyInfo(driverError.sqlMessage);
  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Foreign key constraint failed',
      path: request.url,
      type: 'db.foreign_key_violation',
      errors: [
        {
          field,
          message: `The provided value for '${field}' does not reference an existing record.`,
        },
      ],
    }),
  );
}
