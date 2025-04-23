import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  type?: ErrorType;
  errors?: FieldError[];
  meta?: any;
}
