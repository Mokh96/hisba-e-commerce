import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { extractFieldFromMySqlMessage, extractValueFromMessage } from 'src/common/exceptions/utils/query-failed-parser';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';
import { QueryFailedError } from 'typeorm';
import { SENSITIVE_FIELDS } from 'src/common/exceptions/constants/sensitive-fields.constant';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

interface UniqueConstraintErrorParams {
  field: string;
  value?: string;
  /**
   * This option is used to prevent sensitive data from being exposed.
   * */
  safeLabel?: string;
}

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
  const status = HttpStatus.CONFLICT;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: 'Unique constraint failed',
      path: request.url,
      type: ErrorType.DuplicateKey,
      errors: [generateUniqueConstraintError({ field, value })],
    }),
  );
}

export default handleUniqueViolation;

export function generateUniqueConstraintError({ field, value, safeLabel }: UniqueConstraintErrorParams) {
  const isSensitive = SENSITIVE_FIELDS.includes(field);
  const label = safeLabel ?? field;

  const message = isSensitive || !value ? `This ${label} is already taken` : `The ${label} '${value}' is already taken`;

  return {
    field,
    message,
  };
}
