import { ApiErrorResponse, FieldError } from '../interfaces/api-error-response.interface';
import { HttpStatus } from '@nestjs/common';
import getErrorTitle from 'src/common/exceptions/helpers/get-error-title.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import { PathImpl2 } from '@nestjs/config';
import { I18nMsgType } from 'src/startup/i18n/i18n.types';

function createErrorResponse(params: {
  statusCode: HttpStatus;
  message: string | I18nMsgType; //return string if no i18n
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
    meta: params.meta,
  };
}

export default createErrorResponse;
