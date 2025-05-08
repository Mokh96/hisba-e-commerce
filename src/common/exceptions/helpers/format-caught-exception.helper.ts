import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FieldError, ApiErrorResponse } from '../interfaces/api-error-response.interface';
import { extractFieldFromMessage } from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-util';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import dbErrorHandlers from 'src/common/exceptions/filters/query-failed-exception/db-handlers/db-error-handlers';
import generateUnknownDbErrorMsg from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-db-error';
import generateUnauthorizedErrorMsg from 'src/common/exceptions/filters/unauthorized-exception/unauthorized-error-msg.generator';
import generateForbiddenErrorMsg from 'src/common/exceptions/filters/forbidden-exception/forbidden-error-msg.generator';
import generateNotFoundErrorMsg from 'src/common/exceptions/filters/not-found-exception/not-found-error-msg.generator';

export function formatCaughtException(exception: any, path: string): ApiErrorResponse {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let type = ErrorType.Internal;
  let errors: FieldError[] | undefined;

  console.log('formatCaughtException', exception);

  console.log('test', exception instanceof TypeORMError);
  console.log('test', exception instanceof QueryFailedError);
  console.log('test', exception instanceof HttpException);

  if (exception instanceof QueryFailedError) {
    const driverError = exception.driverError;
    const generatorErrorMsg: (exception: QueryFailedError) => ApiErrorResponse =
      dbErrorHandlers[driverError.code] || generateUnknownDbErrorMsg;

    return generatorErrorMsg(exception);
  }

  if (exception instanceof HttpException) {
    const raw = exception.getResponse() as any;

    statusCode = exception.getStatus();
    message = typeof raw === 'string' ? raw : raw?.message || message;

    console.log('raw', raw);
    console.log('statusCode', statusCode);
    console.log('message', message);

    if (exception instanceof UnauthorizedException) {
      return generateUnauthorizedErrorMsg(exception);
    } else if (exception instanceof ForbiddenException) {
      return generateForbiddenErrorMsg(exception);
    } else if (exception instanceof EntityNotFoundError || exception instanceof NotFoundException) {
      generateNotFoundErrorMsg(exception);
    } else {
      // Assume validation or other known HttpExceptions
      type = ErrorType.Validation;

      if (Array.isArray(raw?.message)) {
        errors = raw.message.map((msg: string) => ({
          field: extractFieldFromMessage(msg).field,
          message: extractFieldFromMessage(msg).message,
        }));
      } else {
        errors = [
          {
            field: '_global',
            message,
          },
        ];
      }
    }
  }

  return createErrorResponse({
    statusCode,
    message,
    path,
    type,
    errors,
  });
}
