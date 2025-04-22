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
  MYSQL_INVALID_VALUE_CODE, MYSQL_LOCK_WAIT_TIMEOUT,
  MYSQL_NON_NULL_CONSTRAINT_CODE,
  MYSQL_UNIQUE_CONSTRAINT_CODE,
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
import {
  handleLockTimeoutViolation
} from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-lock-timeout-violation';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('QueryFailedError', exception);
    const driverError = exception.driverError;

    if (driverError?.code === MYSQL_UNIQUE_CONSTRAINT_CODE) {
      return handleUniqueViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_FOREIGN_KEY_CONSTRAINT_CODE) {
      return handleForeignKeyViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_NON_NULL_CONSTRAINT_CODE) {
      return handleNotNullViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_DATA_TOO_LONG_CONSTRAINT_CODE) {
      return handleDataTooLong(exception, response, request);
    }

    if (driverError?.code === MYSQL_FOREIGN_KEY_DELETION_CODE) {
      return handleForeignKeyDeletionViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_INVALID_VALUE_CODE) {
      return handleInvalidValueForField(exception, response, request);
    }

    if (driverError?.code === MYSQL_CHECK_CONSTRAINT_CODE) {
      return handleCheckConstraintViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_DEADLOCK_CONSTRAINT_CODE) {
      return handleDeadlockViolation(exception, response, request);
    }

    if (driverError?.code === MYSQL_LOCK_WAIT_TIMEOUT) {
      return handleLockTimeoutViolation(exception, response, request);
    }

    // fallback generic response
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      createErrorResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Database Error',
        message: exception.message,
        path: request.url,
        type: 'db.query_failed',
      }),
    );
  }
}

export function extractForeignKeyInfo(message: string) {
  const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
  const field = match ? match[1] : 'unknown';
  return { field };
}
