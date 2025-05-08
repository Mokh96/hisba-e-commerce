import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FieldError, ApiErrorResponse } from '../interfaces/api-error-response.interface';
import { extractFieldFromMessage } from 'src/common/exceptions/filters/bad-request-exception/validation-exception-util';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import dbErrorHandlers from 'src/common/exceptions/filters/query-failed-exception/db-handlers/db-error-handlers';
import generateUnknownDbErrorMsg from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-db-error';
import generateUnauthorizedErrorMsg from 'src/common/exceptions/filters/unauthorized-exception/unauthorized-error-msg.generator';
import generateForbiddenErrorMsg from 'src/common/exceptions/filters/forbidden-exception/forbidden-error-msg.generator';
import generateNotFoundErrorMsg from 'src/common/exceptions/filters/not-found-exception/not-found-error-msg.generator';
import generateServerErrorMsg from 'src/common/exceptions/filters/server-exception/server-error-msg.generator';
import generateBadRequestErrorMsg from 'src/common/exceptions/filters/bad-request-exception/bad-request-error-msg.generator';

export function formatCaughtException(exception: any, path: string): ApiErrorResponse {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let type = ErrorType.Internal;
  let errors: FieldError[] | undefined;

  console.log('formatCaughtException', exception);

  console.log('test TypeORMError', exception instanceof TypeORMError);
  console.log('test QueryFailedError', exception instanceof QueryFailedError);
  console.log('test HttpException', exception instanceof HttpException);
  console.log('test UnauthorizedException', exception instanceof UnauthorizedException);
  console.log('test ForbiddenException', exception instanceof ForbiddenException);

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
    }
    if (exception instanceof ForbiddenException) {
      return generateForbiddenErrorMsg(exception);
    }
    if (exception instanceof EntityNotFoundError || exception instanceof NotFoundException) {
      generateNotFoundErrorMsg(exception);
    }
    if (exception instanceof BadRequestException) {
      return generateBadRequestErrorMsg(exception);
    }
  }

  return generateServerErrorMsg(exception); //fallback message
}
