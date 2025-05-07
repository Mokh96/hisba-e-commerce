import { QueryFailedError } from 'typeorm';
import { extractFieldFromMySqlMessage } from 'src/common/exceptions/utils/query-failed-parser';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';
import { Response, Request } from 'express';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

/**
 * Handles MySQL foreign key deletion constraint violations.
 *
 * This occurs when attempting to delete or update a record that is still referenced by other records through a foreign key.
 * Responds with HTTP 400 Bad Request and includes the field that caused the conflict.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
export function handleForeignKeyDeletionViolation(exception: QueryFailedError, response: Response, request: Request) {
  const driverError = exception.driverError;
  const field = extractFieldFromMySqlMessage(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Foreign key deletion constraint failed',
      path: request.url,
      type: ErrorType.ForeignKeyDeletion,
      errors: [
        {
          field,
          message: `Cannot delete or update '${field}' because it is still referenced by other records.`,
        },
      ],
    }),
  );
}
