import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log("GlobalExceptionFilter" , exception);
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = createErrorResponse({
      statusCode: status,
      message: 'Internal server error',
      path: request.url,
      type: ErrorType.Internal,
    });

    response.status(status).json(errorResponse);
  }
}
