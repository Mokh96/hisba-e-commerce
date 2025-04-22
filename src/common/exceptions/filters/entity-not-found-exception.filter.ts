import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response, Request } from 'express';
import { createErrorResponse } from '../helpers/error-response.helper';

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
@Catch(EntityNotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const entity = extractEntityFromMessage(exception.message);

    return response.status(HttpStatus.NOT_FOUND).json(
      createErrorResponse({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `${entity} not found`,
        path: request.url,
        type: 'db.entity_not_found',
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
