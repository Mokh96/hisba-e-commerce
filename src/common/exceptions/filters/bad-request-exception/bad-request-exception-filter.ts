import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import generateBadRequestErrorMsg from 'src/common/exceptions/filters/bad-request-exception/bad-request-error-msg.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const basRequestErrorMsg = generateBadRequestErrorMsg(exception);
    const toClient: ApiErrorResponse = {
      ...basRequestErrorMsg,
      path: request.url,
    };
    return response.status(toClient.statusCode || HttpStatus.BAD_REQUEST).json(toClient);
  }
}
