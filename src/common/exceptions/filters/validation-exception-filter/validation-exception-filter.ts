import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { extractFieldFromMessage } from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-util';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const rawErrors = exception.getResponse() as any;

    //Handle single message string
    if (typeof rawErrors.message === 'string') {
      return response.status(HttpStatus.BAD_REQUEST).json(
        createErrorResponse({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: rawErrors.message,
          path: request.url,
          type: 'validation_error',
          errors: [
            {
              field: '_global',
              message: rawErrors.message,
            },
          ],
        }),
      );
    }

    // Handle both arrays of messages
    let errorItems = Array.isArray(rawErrors.message) ? rawErrors.message : [];

    // Process array of error messages
    const errors = errorItems.map((errorItem: string) => {
      if (typeof errorItem === 'string') {
        // Extract field and message from string errors
        const { field, message } = extractFieldFromMessage(errorItem);

        return {
          field,
          message,
        };
      } else {
        // Fallback for other error formats
        return {
          field: '_global',
          message: typeof errorItem === 'string' ? errorItem : JSON.stringify(errorItem),
        };
      }
    });

    return response.status(HttpStatus.BAD_REQUEST).json(
      createErrorResponse({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Validation failed',
        path: request.url,
        type: 'validation_error',
        errors,
      }),
    );
  }
}
