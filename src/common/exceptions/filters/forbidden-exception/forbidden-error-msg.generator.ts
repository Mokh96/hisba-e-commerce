import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

function generateForbiddenErrorMsg(exception: ForbiddenException): ApiErrorResponse {
  const raw = exception.getResponse() as any;
  const message = typeof raw === 'string' ? raw : raw?.message || 'Access forbidden';

  return createErrorResponse({
    statusCode: HttpStatus.FORBIDDEN,
    message,
    type: ErrorType.AuthForbidden,
  });
}
export default generateForbiddenErrorMsg
