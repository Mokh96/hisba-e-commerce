import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractFieldFromKeyMessage } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

export function generateInvalidValueForFieldErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const driverError = exception.driverError;
  const field = extractFieldFromKeyMessage(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.invalidValueForField'),
    type: ErrorType.InvalidValue,
    errors: [
      {
        field,
        message: translate('errors.db.invalidValueForFieldWithField', { args: { field } }),
      },
    ],
  });
}

export default generateInvalidValueForFieldErrorMsg;
