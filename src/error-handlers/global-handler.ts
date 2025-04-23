import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Optional: log the error for debugging
    console.error('Unhandled error:', exception);

    const errorResponse = createErrorResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      path: request.url,
      error: 'InternalServerError',
      type: 'internal_error',
    });

    response.status(status).json(errorResponse);
  }
}
