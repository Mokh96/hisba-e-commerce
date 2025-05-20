import { QueryFailedError } from 'typeorm';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import {
  generateDataOutOfRangeErrorMsg,
  generateDataTooLongErrorMsg,
  generateDeadlockViolationErrorMsg,
  generateForeignKeyDeletionErrorMessage,
  generateForeignKeyViolationMessage,
  generateInvalidValueForFieldErrorMsg,
  generateLockTimeoutViolationErrorMsg,
  generateNotNullViolationErrorMsg,
  generateSqlParseErrorMsg,
  generateUnknownColumnErrorMsg,
} from 'src/common/exceptions/filters/query-failed-exception/db-handlers';
import generateUniqueViolationErrorMsg from 'src/common/exceptions/filters/query-failed-exception/db-handlers/generate-unique-violation-error-message';

const dbErrorHandlers: Record<string, (exception: QueryFailedError) => ApiErrorResponse> = {
  ER_DUP_ENTRY: generateUniqueViolationErrorMsg, //unique constraint
  ER_NO_REFERENCED_ROW_2: generateForeignKeyViolationMessage,
  ER_ROW_IS_REFERENCED_2: generateForeignKeyDeletionErrorMessage,
  ER_DATA_TOO_LONG: generateDataTooLongErrorMsg,
  ER_BAD_NULL_ERROR: generateNotNullViolationErrorMsg,
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: generateInvalidValueForFieldErrorMsg,
  ER_DATA_OUT_OF_RANGE: generateDataOutOfRangeErrorMsg,
  ER_PARSE_ERROR: generateSqlParseErrorMsg,
  ER_LOCK_DEADLOCK: generateDeadlockViolationErrorMsg,
  ER_LOCK_WAIT_TIMEOUT: generateLockTimeoutViolationErrorMsg,
  ER_BAD_FIELD_ERROR: generateUnknownColumnErrorMsg,
};

export default dbErrorHandlers;
