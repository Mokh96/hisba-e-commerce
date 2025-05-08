import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import generateNotFoundErrorMsg from 'src/common/exceptions/filters/not-found-exception/not-found-error-msg.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

/**
 * Handles TypeORM EntityNotFoundError.
 *
 * This occurs when a requested entity is not found in the database (e.g. via findOneOrFail).
 * Responds with HTTP 404 Not Found and includes the missing entity name in the response.
 *
 * @param exception - The EntityNotFoundError thrown by TypeORM.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
@Catch(EntityNotFoundError, NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const notFoundErrorMsg = generateNotFoundErrorMsg(exception);

    const toClientErrorMessage: ApiErrorResponse = {
      ...notFoundErrorMsg,
      path: request.url,
    };

    return response.status(toClientErrorMessage.statusCode || HttpStatus.NOT_FOUND).json(toClientErrorMessage);
  }
}
