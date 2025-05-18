import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

/**
 * Handles SQL syntax parsing errors (ER_PARSE_ERROR).
 *
 * This occurs when the SQL query is malformed or has invalid syntax.
 * Responds with HTTP 400 Bad Request and includes a generic message.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object for context.
 */
export function handleSqlParseError(
  exception: QueryFailedError,
  response: Response,
  request: Request,
) {
  const status = HttpStatus.BAD_REQUEST;

  return response.status(status).json(
    createErrorResponse({
      statusCode: status,
      message: translate('errors.invalidSqlSyntax') as string,
      path: request.url,
      type: ErrorType.SqlSyntaxError,
      errors: [
        {
          field: 'query',
          message: translate('errors.sqlParsingFailed') as string,
        },
      ],
    }),
  );
}

export function generateSqlParseErrorMsg(exception: QueryFailedError) : ApiErrorResponse {
  const status = HttpStatus.BAD_REQUEST;
  return createErrorResponse({
    statusCode: status,
    message: translate('errors.invalidSqlSyntax') as string,
    type: ErrorType.SqlSyntaxError,
    errors: [
      {
        field: 'query',
        message: translate('errors.sqlParsingFailed') as string,
      },
    ],
  })
}

export default generateSqlParseErrorMsg;
