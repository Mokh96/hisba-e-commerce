import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { Response, Request } from 'express';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

/**
 * Handles data out-of-range errors (ER_DATA_OUT_OF_RANGE).
 *
 * This occurs when inserting or updating a value that exceeds
 * the allowed range for the column (e.g., tinyint, varchar).
 * Responds with HTTP 400 Bad Request and includes a helpful message.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object for context.
 */
export function generateDataOutOfRangeError(exception: QueryFailedError, response: Response, request: Request) {
  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Provided data exceeds the allowed range.',
      path: request.url,
      type: ErrorType.DataOutOfRange,
      errors: [
        {
          field: 'value',
          message: 'A value is too large or too small for its column type.',
        },
      ],
    }),
  );
}

/**
 * Generates an error response for data out-of-range errors (ER_DATA_OUT_OF_RANGE).
 *
 * This occurs when a value exceeds the allowed range for a column (e.g., tinyint, varchar).
 * Returns an `ApiErrorResponse` object with details about the error.
 *
 * @param exception - The `QueryFailedError` thrown by the database.
 * @returns An `ApiErrorResponse` object containing error details.
 */
export function generateDataOutOfRangeErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const status = HttpStatus.BAD_REQUEST;
  return createErrorResponse({
    statusCode: status,
    message: 'Provided data exceeds the allowed range.',
    type: ErrorType.DataOutOfRange,
    errors: [
      {
        field: 'value',
        message: 'A value is too large or too small for its column type.',
      },
    ],
  });
}

export default generateDataOutOfRangeErrorMsg;
