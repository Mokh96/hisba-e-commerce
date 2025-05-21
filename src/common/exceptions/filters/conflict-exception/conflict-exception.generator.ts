import { ConflictException, HttpStatus } from '@nestjs/common';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

function generateConflictErrorMsg(exception: ConflictException): ApiErrorResponse {
  const raw = exception.getResponse() as any;
  return createErrorResponse({
    statusCode: HttpStatus.CONFLICT,
    message: raw.message,
    type: ErrorType.Conflict,
  });
}

export default generateConflictErrorMsg;
