import { HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

function generateServerErrorMsg<E extends unknown>(exception: E): ApiErrorResponse {
  return createErrorResponse({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    type: ErrorType.Internal,
  });
}

export default generateServerErrorMsg;
