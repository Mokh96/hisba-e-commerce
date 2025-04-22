import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import {
  MYSQL_CHECK_CONSTRAINT_CODE,
  MYSQL_DATA_TOO_LONG_CONSTRAINT_CODE,
  MYSQL_DEADLOCK_CONSTRAINT_CODE,
  MYSQL_FOREIGN_KEY_CONSTRAINT_CODE,
  MYSQL_FOREIGN_KEY_DELETION_CODE,
  MYSQL_INVALID_VALUE_CODE,
  MYSQL_LOCK_WAIT_TIMEOUT,
  MYSQL_NON_NULL_CONSTRAINT_CODE,
  MYSQL_UNIQUE_CONSTRAINT_CODE,
  MYSQL_UNKNOWN_COLUMN,
} from 'src/common/exceptions/constants/errors-code.constant';
import {
  handleForeignKeyViolation,
  handleUniqueViolation,
} from 'src/common/exceptions/filters/query-failed-exception/db-handlers';
import { handleNotNullViolation } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-not-null-violation';
import { handleDataTooLong } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-data-too-long';
import { handleForeignKeyDeletionViolation } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-foreign-key-deletion-violation';
import { handleInvalidValueForField } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-invalid-value-for-field';
import { handleCheckConstraintViolation } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-check-constraint-violation';
import { handleDeadlockViolation } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-deadlock-violation';
import { handleLockTimeoutViolation } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-lock-timeout-violation';
import { handleUnknownColumnError } from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-column-error';
import dbErrorHandlers from 'src/common/exceptions/filters/query-failed-exception/db-handlers/db-error-handlers';
import handleUnknownDbError from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-db-error';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('QueryFailedError', exception);
    const code = exception.driverError?.code;
    const handler = dbErrorHandlers[code] || handleUnknownDbError;

    return handler(exception, response, request);
  }
}

export function extractForeignKeyInfo(message: string) {
  const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
  const field = match ? match[1] : 'unknown';
  return { field };
}
