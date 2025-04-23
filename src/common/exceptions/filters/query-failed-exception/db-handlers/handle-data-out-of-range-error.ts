import { QueryFailedError } from 'typeorm';
import { extractFieldFromMySqlMessage } from 'src/common/exceptions/utils/query-failed-parser';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';
import { Response, Request } from 'express';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

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
export function handleDataOutOfRangeError(exception: QueryFailedError, response: Response, request: Request) {
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
