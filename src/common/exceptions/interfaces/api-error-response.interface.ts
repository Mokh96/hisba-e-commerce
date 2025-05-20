import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { I18nMsgType } from 'src/startup/i18n/i18n.types';

export interface FieldError {
  field: string;
  message: string | I18nMsgType;//use string if no i18n
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string | I18nMsgType;//use string if no i18n;
  message: string | I18nMsgType;//use string if no i18n
  timestamp: string;
  path: string;
  type?: ErrorType;
  errors?: FieldError[];
  meta?: any;
}
