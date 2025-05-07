import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';
import createErrorResponse from '../utils/create-error-response.util';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

/**
 * Handles TypeORM EntityNotFoundError.
 *
 * This occurs when a requested entity is not found in the database (e.g. via findOneOrFail).
 * Responds with HTTP 404 Not Found and includes the missing entity name in the response.
 *
 * @param exception - The EntityNotFoundError thrown by TypeORM.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
@Catch(EntityNotFoundError , NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const entity = extractEntityFromMessage(exception.message);
    const status = HttpStatus.NOT_FOUND

    return response.status(status).json(
      createErrorResponse({
        statusCode: status,
        message: `${entity} not found`,
        path: request.url,
        type: ErrorType.EntityNotFound,
        errors: [
          {
            field: entity.toLowerCase(),
            message: `${entity} does not exist.`,
          },
        ],
      }),
    );
  }
}

/**
 * Extracts the entity name from the exception message.
 * Example message: "No entity found for query; Entity \"User\" was not found"
 */
function extractEntityFromMessage(message: string): string {
  const match = message.match(/"(.+?)"/);
  return match?.[1] ?? 'Entity';
}
