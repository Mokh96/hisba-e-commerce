import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { QueryFailedError } from 'typeorm';
import { Request } from 'express';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractForeignKeyInfo } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

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

  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Foreign key constraint failed',
      path: request.url,
      type: ErrorType.ForeignKey,
      errors: [
        {
          field,
          message: `The provided value for '${field}' does not reference an existing record.`,
        },
      ],
    }),
  );
}

export function generateForeignKeyViolationMessage(exception: QueryFailedError): ApiErrorResponse {
  const driverError = exception.driverError;
  const { field } = extractForeignKeyInfo(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: 'Foreign key constraint failed',
    //path: request.url,
    type: ErrorType.ForeignKey,
    errors: [
      {
        field,
        message: `The provided value for '${field}' does not reference an existing record.`,
      },
    ],
  });
}

export default generateForeignKeyViolationMessage;
