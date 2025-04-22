import { QueryFailedError } from 'typeorm';
import { extractFieldFromMySqlMessage } from 'src/common/exceptions/utils/query-failed-parser';
import { HttpStatus } from '@nestjs/common';
import {Request , Response} from "express"
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

/**
 * Handles MySQL invalid value errors for fields.
 *
 * This occurs when a field receives a value of the wrong type or format (e.g., inserting a string into an integer column).
 * Responds with HTTP 400 Bad Request and includes the invalid field in the response body.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleInvalidValueForField(exception: QueryFailedError, response: Response, request: Request) {
  const driverError = exception.driverError;
  const field = extractFieldFromMySqlMessage(driverError.sqlMessage);

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Invalid value for field',
      path: request.url,
      type: 'db.invalid_value',
      errors: [
        {
          field,
          message: `The provided value for '${field}' is invalid or of incorrect type.`,
        },
      ],
    }),
  );
}
