import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractForeignKeyField } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { translate } from 'src/startup/i18n/i18n.provider';

export function generateForeignKeyDeletionErrorMessage(exception: QueryFailedError) {
  const driverError = exception.driverError;
  const field = extractForeignKeyField(driverError.sqlMessage);

  const status = HttpStatus.BAD_REQUEST;
  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.foreignKeyDeletionConstraintFailed'),
    type: ErrorType.ForeignKeyDeletion,
    errors: [
      {
        field,
        message: translate('errors.db.foreignKeyDeletionConstraintError', { args: { field } }),
      },
    ],
  });
}

export default generateForeignKeyDeletionErrorMessage;
