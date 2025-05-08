import { ExceptionFilter, Catch, ArgumentsHost, ForbiddenException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const raw = exception.getResponse() as any;

    const message = typeof raw === 'string' ? raw : raw?.message || 'Access forbidden';

    return response.status(HttpStatus.FORBIDDEN).json(
      createErrorResponse({
        statusCode: HttpStatus.FORBIDDEN,
        message,
        path: request.url,
        type: ErrorType.AuthForbidden,
        /*errors: [
          {
            field: '_global',
            message,
          },
        ],*/
      }),
    );
  }
}
