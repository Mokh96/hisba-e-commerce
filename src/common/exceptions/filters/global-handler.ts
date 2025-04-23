import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

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
      statusCode: status,
      message: 'Internal server error',
      path: request.url,
      type: ErrorType.Internal,
    });

    response.status(status).json(errorResponse);
  }
}
