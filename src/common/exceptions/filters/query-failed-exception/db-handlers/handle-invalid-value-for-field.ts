import { QueryFailedError } from 'typeorm';
import { extractFieldFromMySqlMessage } from 'src/common/exceptions/utils/query-failed-parser';
import { HttpStatus } from '@nestjs/common';
import {Request , Response} from "express"
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';

export function handleInvalidValueForField(exception: QueryFailedError, response: Response, request: Request) {
  const driverError = exception.driverError;
  const field = extractFieldFromMySqlMessage(driverError.sqlMessage);

  return response.status(HttpStatus.BAD_REQUEST).json(
    createErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Invalid value for field',
      path: request.url,
      type: 'db.invalid_value',
      errors: [
        {
          field,
          message: `The provided value for '${field}' is invalid or of incorrect type.`,
        },
      ],
    }),
  );
}
