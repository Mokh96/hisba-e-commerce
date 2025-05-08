import { BadRequestException, HttpStatus } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { extractFieldFromMessage } from 'src/common/exceptions/filters/bad-request-exception/validation-exception-util';

function generateBadRequestErrorMsg(exception: BadRequestException): ApiErrorResponse {
  const rawErrors = exception.getResponse() as any;
  const status = HttpStatus.BAD_REQUEST;

  //Handle a single message string
  if (typeof rawErrors.message === 'string') {
    return createErrorResponse({
      statusCode: status,
      message: rawErrors.message,
      type: ErrorType.Validation,
      errors: [
        {
          field: '_global',
          message: rawErrors.message,
        },
      ],
    });
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

  return createErrorResponse({
    statusCode: status,
    message: 'Validation failed',
    type: ErrorType.Validation,
    errors,
  });
}

export default generateBadRequestErrorMsg;