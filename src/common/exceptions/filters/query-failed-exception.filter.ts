import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';
import { createErrorResponse } from '../helpers/error-response.helper';
import { UNIQUE_ERROR_CODE } from 'src/common/exceptions/constants/errors-code.constant';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);

    const isUniqueConstraint = (exception as any).code === UNIQUE_ERROR_CODE;
    const detail = (exception as any).detail || '';

    response.status(HttpStatus.CONFLICT).json(
      createErrorResponse({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: 'Unique constraint failed',
        path: request.url,
        type: 'db.unique_violation',
        errors: [
          {
            field: extractFieldFromDetail(detail),
            message: 'Value already exists',
          },
        ],
      }),
    );
  }
}

function extractFieldFromDetail(detail: string): string {
  // Try to extract column name from detail string
  const match = detail.match(/\(([^)]+)\)=/);
  return match ? match[1] : 'unknown';
}
