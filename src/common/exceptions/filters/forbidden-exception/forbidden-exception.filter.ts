import { ExceptionFilter, Catch, ArgumentsHost, ForbiddenException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import generateForbiddenErrorMsg from 'src/common/exceptions/filters/forbidden-exception/forbidden-error-msg.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const forbiddenErrorMsg = generateForbiddenErrorMsg(exception);
    const toClientErrorMessage: ApiErrorResponse = {
      ...forbiddenErrorMsg,
      path: request.url,
    };
    return response.status(toClientErrorMessage.statusCode || HttpStatus.FORBIDDEN).json(toClientErrorMessage);
  }
}
