import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { FileValidationException } from 'src/common/exceptions/custom-exceptions/file-validation.exception';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(FileValidationException)
export class FileValidationFilter implements ExceptionFilter {
  catch(exception: FileValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;

    return response.status(status).json(
      createErrorResponse({
        statusCode: status,
        message: exception.message,
        path: request.url,
        type: exception.type,
        meta: exception.meta,
      }),
    );
  }
}
