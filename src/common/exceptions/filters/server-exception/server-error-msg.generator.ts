import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

function generateServerErrorMsg<E extends unknown>(exception: E): ApiErrorResponse {
  return createErrorResponse({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: translate('errors.internalServerError') as string,
    type: ErrorType.Internal,
  });
}

export default generateServerErrorMsg;
