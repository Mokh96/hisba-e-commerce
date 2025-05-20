import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { QueryFailedError } from 'typeorm';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractForeignKeyInfo } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

export function generateForeignKeyViolationMessage(exception: QueryFailedError): ApiErrorResponse {
  const driverError = exception.driverError;
  const { field } = extractForeignKeyInfo(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.foreignKeyConstraintFailed'),
    type: ErrorType.ForeignKey,
    errors: [
      {
        field,
        message: translate('errors.db.foreignKeyConstraintError', { args: { field } }),
      },
    ],
  });
}

export default generateForeignKeyViolationMessage;
