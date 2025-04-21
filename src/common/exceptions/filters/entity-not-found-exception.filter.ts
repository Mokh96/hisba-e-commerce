import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';
import { createErrorResponse } from '../helpers/error-response.helper';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json(
      createErrorResponse({
        statusCode: 404,
        error: 'Not Found',
        message: 'Resource not found',
        path: request.url,
        type: 'db.entity_not_found',
      })
    );
  }
}
