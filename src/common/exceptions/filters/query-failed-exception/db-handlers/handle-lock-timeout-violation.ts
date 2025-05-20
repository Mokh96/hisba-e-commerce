import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';



export function generateLockTimeoutViolationErrorMsg(exception: QueryFailedError): ApiErrorResponse {
  const status = HttpStatus.REQUEST_TIMEOUT;
  return createErrorResponse({
    statusCode: status,
    message: translate('errors.db.lockTimeOutError'),
    type: ErrorType.LockTimeOut,
  });
}

export default generateLockTimeoutViolationErrorMsg;
