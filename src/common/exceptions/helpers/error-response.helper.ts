import { ApiErrorResponse, FieldError } from '../interfaces/api-error-response.interface';

export function createErrorResponse(params: {
  statusCode: number;
  error: string;
  message: string;
  path: string;
  type?: string;
  errors?: FieldError[];
}): ApiErrorResponse {
  return {
    statusCode: params.statusCode,
    error: params.error,
    message: params.message,
    timestamp: new Date().toISOString(),
    path: params.path,
    type: params.type,
    errors: params.errors,
  };
}
