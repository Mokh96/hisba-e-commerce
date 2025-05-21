import { ExceptionFilter, Catch, ArgumentsHost, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import generateConflictErrorMsg from 'src/common/exceptions/filters/conflict-exception/conflict-exception.generator';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const conflictErrorMsg = generateConflictErrorMsg(exception);
    const toClientErrorMessage: ApiErrorResponse = {
      ...conflictErrorMsg,
      path: request.url,
    };

    return response.status(toClientErrorMessage.statusCode || HttpStatus.CONFLICT).json(toClientErrorMessage);
  }
}
