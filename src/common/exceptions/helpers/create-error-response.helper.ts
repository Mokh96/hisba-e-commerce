import { ApiErrorResponse, FieldError } from '../interfaces/api-error-response.interface';
import { HttpStatus } from '@nestjs/common';
import getErrorTitle from 'src/common/exceptions/helpers/get-error-title.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

function createErrorResponse(params: {
  statusCode: HttpStatus;
  message: string;
  path?: string;
  meta?: any;
  error?: string;
  type?: ErrorType;
  errors?: FieldError[];
}): ApiErrorResponse {
  return {
    statusCode: params.statusCode,
    error: params.error ?? getErrorTitle(params.statusCode),
    message: params.message,
    timestamp: new Date().toISOString(),
    path: params.path,
    type: params.type,
    errors: params.errors,
    meta : params.meta
  };
}

export default createErrorResponse;
