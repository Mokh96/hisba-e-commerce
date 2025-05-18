import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { translate } from 'src/startup/i18n/i18n.provider';

function generateForbiddenErrorMsg(exception: ForbiddenException): ApiErrorResponse {
  const raw = exception.getResponse() as any;
  const message = typeof raw === 'string' ? raw : raw?.message || translate('errors.accessForbidden');

  return createErrorResponse({
    statusCode: HttpStatus.FORBIDDEN,
    message,
    type: ErrorType.AuthForbidden,
  });
}

export default generateForbiddenErrorMsg;
