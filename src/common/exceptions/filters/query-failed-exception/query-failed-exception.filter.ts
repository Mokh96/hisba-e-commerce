import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import dbErrorHandlers from 'src/common/exceptions/filters/query-failed-exception/db-handlers/db-error-handlers';
import generateUnknownDbErrorMsg from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-db-error';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('QueryFailedError', exception);
    const code = exception.driverError?.code;
    const generatorErrorMsg: (exception: QueryFailedError) => ApiErrorResponse =
      dbErrorHandlers[code] || generateUnknownDbErrorMsg;

    const errorMessage = generatorErrorMsg(exception);
    const toClientErrorMessage : ApiErrorResponse = {
      ...errorMessage,
      path: request.url,
    }

    return response.status(errorMessage.statusCode).json(toClientErrorMessage);
  }
}
