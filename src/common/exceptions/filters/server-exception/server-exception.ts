import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import generateServerErrorMsg from 'src/common/exceptions/filters/server-exception/server-error-msg.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(Error)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const serverErrorMsg = generateServerErrorMsg(exception);

    const toClientErrorMessage: ApiErrorResponse = {
      ...serverErrorMsg,
      path: request.url,
    };

    response.status(toClientErrorMessage.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json(toClientErrorMessage);
  }
}
