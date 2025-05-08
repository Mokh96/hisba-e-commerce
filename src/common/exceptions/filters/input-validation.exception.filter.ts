import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { request, Response } from 'express';
import InputValidationException from 'src/common/exceptions/custom-exceptions/input-validation.exception';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(InputValidationException)
export class InputValidationFilter implements ExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json(
      createErrorResponse({
        statusCode: status,
        message: exception.message,
        type: ErrorType.Validation,
        path: request.url,
        errors: exception.getResponse()['errors'],
      }),
    );
  }
}
