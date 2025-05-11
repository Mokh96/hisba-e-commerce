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

export function formatCaughtException(exception: unknown): ApiErrorResponse {
  //console.log('formatCaughtException', exception);

  if (exception instanceof QueryFailedError) {
    const driverError = exception.driverError;
    const generatorErrorMsg: (exception: QueryFailedError) => ApiErrorResponse =
      dbErrorHandlers[driverError.code] || generateUnknownDbErrorMsg;

    return generatorErrorMsg(exception);
  }

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

  return generateServerErrorMsg(exception); //fallback message
}
