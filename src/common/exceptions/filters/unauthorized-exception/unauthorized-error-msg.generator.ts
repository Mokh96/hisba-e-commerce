import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

function generateUnauthorizedErrorMsg(exception: UnauthorizedException): ApiErrorResponse {
  const status = HttpStatus.UNAUTHORIZED;
  const raw = exception.getResponse() as any;
  const message = typeof raw === 'string' ? raw : raw?.message || 'Unauthorized access';

  return createErrorResponse({
    statusCode: status,
    message,
    type: ErrorType.AuthUnauthorized,
  });
}

export default generateUnauthorizedErrorMsg;