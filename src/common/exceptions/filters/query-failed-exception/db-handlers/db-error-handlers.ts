import {
  handleUniqueViolation,
  handleForeignKeyViolation,
  handleForeignKeyDeletionViolation,
  handleDataTooLong,
  handleNotNullViolation,
  handleInvalidValueForField,
  handleDeadlockViolation,
  handleLockTimeoutViolation,
  handleUnknownColumnError,
  handleDataOutOfRangeError,
  handleSqlParseError,
} from 'src/common/exceptions/filters/query-failed-exception/db-handlers';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

const dbErrorHandlers: Record<string, (exception: QueryFailedError, response: Response, request: Request) => any> = {
  ER_DUP_ENTRY: handleUniqueViolation,
  ER_NO_REFERENCED_ROW_2: handleForeignKeyViolation,
  ER_ROW_IS_REFERENCED_2: handleForeignKeyDeletionViolation,
  ER_DATA_TOO_LONG: handleDataTooLong,
  ER_BAD_NULL_ERROR: handleNotNullViolation,
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: handleInvalidValueForField,
  ER_DATA_OUT_OF_RANGE: handleDataOutOfRangeError,
  ER_PARSE_ERROR: handleSqlParseError,
  ER_LOCK_DEADLOCK: handleDeadlockViolation,
  ER_LOCK_WAIT_TIMEOUT: handleLockTimeoutViolation,
  ER_BAD_FIELD_ERROR: handleUnknownColumnError,
};

export default dbErrorHandlers;
