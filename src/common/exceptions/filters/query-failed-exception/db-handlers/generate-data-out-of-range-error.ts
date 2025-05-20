import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

/**
 * Generates an error response for data out-of-range errors (ER_DATA_OUT_OF_RANGE).
 *
 * This occurs when a value exceeds the allowed range for a column (e.g., tinyint, varchar).
 * Returns an `ApiErrorResponse` object with details about the error.
 *
 * @param exception - The `QueryFailedError` thrown by the database.
 * @returns An `ApiErrorResponse` object containing error details.
 */
export function generateDataOutOfRangeErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.dataOutOfRangeConstraint'),
    type: ErrorType.DataOutOfRange,
    errors: [
      {
        field: 'value',
        message: translate('errors.db.dataOutOfRangeConstraintError'),
      },
    ],
  });
}

export default generateDataOutOfRangeErrorMsg;