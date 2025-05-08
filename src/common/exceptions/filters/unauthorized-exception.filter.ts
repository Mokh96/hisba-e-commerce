import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.UNAUTHORIZED
    const raw = exception.getResponse() as any;
    const message = typeof raw === 'string' ? raw : raw?.message || 'Unauthorized access';

    return response.status(status).json(
      createErrorResponse({
        statusCode: status,
        message,
        path: request.url,
        type: ErrorType.AuthUnauthorized,
      }),
    );
  }
}
