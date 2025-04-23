import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import dbErrorHandlers from 'src/common/exceptions/filters/query-failed-exception/db-handlers/db-error-handlers';
import handleUnknownDbError from 'src/common/exceptions/filters/query-failed-exception/db-handlers/handle-unknown-db-error';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('QueryFailedError', exception);
    const code = exception.driverError?.code;
    const handler = dbErrorHandlers[code] || handleUnknownDbError;

    return handler(exception, response, request);
  }
}

export function extractForeignKeyInfo(message: string) {
  const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
  const field = match ? match[1] : 'unknown';
  return { field };
}
