import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { extractUnknownColumnField } from 'src/common/exceptions/helpers/mysql-parser.helper';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

export function generateUnknownColumnErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const field = extractUnknownColumnField(exception.message);
  const status = HttpStatus.BAD_REQUEST;

  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.unknownColumn'),
    type: ErrorType.UnknownColumn,
    errors: field ? [{ field, message: translate('errors.db.columnDoesNotExist', { args: { field } }) }] : [],
  });
}

export default generateUnknownColumnErrorMsg;
