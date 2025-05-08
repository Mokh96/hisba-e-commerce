import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractUnknownColumnField } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

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
export function handleUnknownColumnError(exception: QueryFailedError, response: Response, request: Request) {
  const field = extractUnknownColumnField(exception.message);

  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'The request references a non-existent column.',
      path: request.url,
      type: ErrorType.UnknownColumn,
      errors: field ? [{ field, message: `Column '${field}' does not exist.` }] : [],
    }),
  );
}

export function generateUnknownColumnErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const field = extractUnknownColumnField(exception.message);
  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: 'The request references a non-existent column.',
    type: ErrorType.UnknownColumn,
    errors: field ? [{ field, message: `Column '${field}' does not exist.` }] : [],
  });
}

export default generateUnknownColumnErrorMsg;
