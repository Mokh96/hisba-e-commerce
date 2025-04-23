import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import createErrorResponse from 'src/common/exceptions/utils/create-error-response.util';
import { extractFieldFromMessage } from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-util';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const rawErrors = exception.getResponse() as any;
    const status = HttpStatus.BAD_REQUEST

    //Handle single message string
    if (typeof rawErrors.message === 'string') {
      return response.status(status).json(
        createErrorResponse({
          statusCode: status,
          message: rawErrors.message,
          path: request.url,
          type: ErrorType.Validation,
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
        statusCode: status,
        message: 'Validation failed',
        path: request.url,
        type: ErrorType.Validation,
        errors,
      }),
    );
  }
}
