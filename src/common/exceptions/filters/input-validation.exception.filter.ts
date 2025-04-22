import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { request, Response } from 'express';
import InputValidationException from 'src/common/exceptions/custom-exceptions/input-validation.exception';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

@Catch(InputValidationException)
export class InputValidationFilter implements ExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json(
      createErrorResponse({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: exception.message,
        type: 'validation_error',
        path: request.url,
        errors: exception.getResponse()['errors'],
      }),
    );
  }
}
