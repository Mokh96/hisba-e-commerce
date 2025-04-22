import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import {
  MYSQL_FOREIGN_KEY_CONSTRAINT_CODE,
  MYSQL_UNIQUE_CONSTRAINT_CODE,
} from 'src/common/exceptions/constants/errors-code.constant';
import { generateUniqueConstraintError } from 'src/common/exceptions/utils/generateUniqueConstraintError';
import { extractFieldFromMySqlMessage, extractValueFromMessage } from 'src/common/exceptions/utils/query-failed-parser';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log("QueryFailedError" , exception);
    const driverError = exception.driverError;


    //const field = extractFieldFromMessage(exception.message);
    const value = extractValueFromMessage(exception.message); // this is your new helper

    if (driverError?.code === MYSQL_UNIQUE_CONSTRAINT_CODE) {
      const field = extractFieldFromMySqlMessage(driverError.sqlMessage);

      return response.status(HttpStatus.CONFLICT).json(
        createErrorResponse({
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Unique constraint failed',
          path: request.url,
          type: 'db.unique_violation',
          errors: [
            generateUniqueConstraintError({
              field,
              value,
            }),
          ],
        }),
      );
    }

    if (driverError?.code === MYSQL_FOREIGN_KEY_CONSTRAINT_CODE) {
      const { field } = extractForeignKeyInfo(driverError.sqlMessage);

      return response.status(HttpStatus.BAD_REQUEST).json(
        createErrorResponse({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Foreign key constraint failed',
          path: request.url,
          type: 'db.foreign_key_violation',
          errors: [
            {
              field,
              message: `The provided value for '${field}' does not reference an existing record.`,
            },
          ],
        }),
      );
    }

    // fallback generic response
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      createErrorResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Database Error',
        message: exception.message,
        path: request.url,
        type: 'db.query_failed',
      }),
    );
  }
}


export function extractForeignKeyInfo(message: string) {
  const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
  const field = match ? match[1] : 'unknown';
  return { field };
}