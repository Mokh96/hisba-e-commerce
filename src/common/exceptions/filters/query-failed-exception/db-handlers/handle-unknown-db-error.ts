import { Response, Request } from 'express';
import { createErrorResponse } from 'src/common/exceptions/helpers/error-response.helper';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';


/**
 * Handles unknown database errors.
 *
 * This occurs when the database throws an error that isn't caught by any other handler.
 * Responds with HTTP 500 Internal Server Error and includes the error message.
 *
 * @param exception - The QueryFailedError thrown by the database.
 * @param response - The HTTP response object to send the error response.
 * @param request - The HTTP request object, used for context (e.g., request URL).
 */
function handleUnknownDbError(exception: QueryFailedError, response: Response, request: Request) {
  return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    createErrorResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Database Error',
      message: exception.message,
      path: request.url,
      type: 'db.unknown_error',
    }),
  );
}
export default handleUnknownDbError
