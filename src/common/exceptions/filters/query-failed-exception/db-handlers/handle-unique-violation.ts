import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { extractFieldFromMySqlMessage, extractValueFromMessage } from 'src/common/exceptions/utils/query-failed-parser';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { generateUniqueConstraintError } from 'src/common/exceptions/utils/generateUniqueConstraintError';
import { QueryFailedError } from 'typeorm';

/**
 * Handles MySQL unique constraint violations.
 *
 * This occurs when attempting to insert or update a record with a value that must be unique
 * (e.g., duplicate username or email). Responds with HTTP 409 Conflict and includes the
 * conflicting field and value in the response body.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleUniqueViolation(exception: QueryFailedError, response: Response, request: Request) {
  const driverError = exception.driverError;
  const field = extractFieldFromMySqlMessage(driverError.sqlMessage);
  const value = extractValueFromMessage(driverError.sqlMessage);

  return response.status(HttpStatus.CONFLICT).json(
    createErrorResponse({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: 'Unique constraint failed',
      path : request.url,
      type: 'db.unique_violation',
      errors: [generateUniqueConstraintError({ field, value })],
    }),
  );
}
