import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

function generateUnauthorizedErrorMsg(exception: UnauthorizedException): ApiErrorResponse {
  const status = HttpStatus.UNAUTHORIZED;
  const raw = exception.getResponse() as any;
  const message = typeof raw === 'string' ? raw : raw?.message || translate('errors.unauthorizedAccess');

  return createErrorResponse({
    statusCode: status,
    message,
    type: ErrorType.AuthUnauthorized,
  });
}

export default generateUnauthorizedErrorMsg;
