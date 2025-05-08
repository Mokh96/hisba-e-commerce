import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractNotNullField } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

/**
 * Handles MySQL NOT NULL constraint violations.
 *
 * This occurs when inserting or updating a record with a NULL value in a column defined as NOT NULL.
 * Responds with HTTP 400 Bad Request and includes the field that violated the NOT NULL constraint.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleNotNullViolation(exception: QueryFailedError, response: Response, request: Request) {
  const field = extractNotNullField(exception.driverError.message);
  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Not-null constraint failed',
      path: request.url,
      type: ErrorType.NonNull,
      errors: [
        {
          field,
          message: `The field '${field}' is required and cannot be null.`,
        },
      ],
    }),
  );
}

export function generateNotNullViolationErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const field = extractNotNullField(exception.driverError.message);
  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: 'Not-null constraint failed',
    type: ErrorType.NonNull,
    errors: [
      {
        field,
        message: `The field '${field}' is required and cannot be null.`,
      },
    ],
  });
}

export default generateNotNullViolationErrorMsg;
