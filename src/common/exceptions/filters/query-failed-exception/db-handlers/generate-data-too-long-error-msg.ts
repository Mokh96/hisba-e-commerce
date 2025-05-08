import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractDataTooLongField } from 'src/common/exceptions/helpers/mysql-parser.helper';

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
export function handleDataTooLongErrorMsg(exception: QueryFailedError, response: Response, request: Request) {
  const field = extractDataTooLongField(exception.driverError.message);
  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Data too long for column',
      path: request.url,
      type: ErrorType.DataTooLong,
      errors: [
        {
          field,
          message: `The value for '${field}' is too long and exceeds the allowed limit.`,
        },
      ],
    }),
  );
}

export function generateDataTooLongErrorMsg(exception: QueryFailedError) {
  const field = extractDataTooLongField(exception.driverError.message);
  const status = HttpStatus.BAD_REQUEST;
  return createErrorResponse({
    statusCode: status,
    message: 'Data too long for column',
    type: ErrorType.DataTooLong,
    errors: [
      {
        field,
        message: `The value for '${field}' is too long and exceeds the allowed limit.`,
      },
    ],
  });
}
export default generateDataTooLongErrorMsg;