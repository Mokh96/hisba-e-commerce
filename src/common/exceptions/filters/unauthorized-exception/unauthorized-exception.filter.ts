import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import generateUnauthorizedErrorMsg from 'src/common/exceptions/filters/unauthorized-exception/unauthorized-error-msg.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.UNAUTHORIZED;

    const unauthorizedErrorMsg = generateUnauthorizedErrorMsg(exception);
    const toClient: ApiErrorResponse = {
      ...unauthorizedErrorMsg,
      path: request.url,
    };
    return response.status(status).json(toClient);
  }
}
