import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractDataTooLongField } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { translate } from 'src/startup/i18n/i18n.provider';

export function generateDataTooLongErrorMsg(exception: QueryFailedError) {
  const field = extractDataTooLongField(exception.driverError.message);
  const status = HttpStatus.BAD_REQUEST;
  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.dataTooLongConstraintFailed'),
    type: ErrorType.DataTooLong,
    errors: [
      {
        field,
        message: translate('errors.db.dataTooLongConstraintError' ,{ args: { field } }),
      },
    ],
  });
}

export default generateDataTooLongErrorMsg;
