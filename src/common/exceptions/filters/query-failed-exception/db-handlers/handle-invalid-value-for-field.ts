import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractFieldFromKeyMessage } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

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
  const field = extractFieldFromKeyMessage(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Invalid value for field',
      path: request.url,
      type: ErrorType.InvalidValue,
      errors: [
        {
          field,
          message: `The provided value for '${field}' is invalid or of incorrect type.`,
        },
      ],
    }),
  );
}

export function generateInvalidValueForFieldErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const driverError = exception.driverError;
  const field = extractFieldFromKeyMessage(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: 'Invalid value for field',
    type: ErrorType.InvalidValue,
    errors: [
      {
        field,
        message: `The provided value for '${field}' is invalid or of incorrect type.`,
      },
    ],
  });
}
export default generateInvalidValueForFieldErrorMsg;