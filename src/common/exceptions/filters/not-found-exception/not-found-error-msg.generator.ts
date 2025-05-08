import { EntityNotFoundError } from 'typeorm';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

function generateNotFoundErrorMsg(exception: EntityNotFoundError | NotFoundException): ApiErrorResponse {
  const status = HttpStatus.NOT_FOUND;
  const entity = extractEntityFromMessage(exception.message);

  return createErrorResponse({
    statusCode: status,
    message: `${entity} not found`,
    type: ErrorType.EntityNotFound,
    errors: [
      {
        field: entity.toLowerCase(),
        message: `${entity} does not exist.`,
      },
    ],
  });
}

/**
 * Extracts the entity name from the exception message.
 * Example message: "No entity found for query; Entity \"User\" was not found"
 */
function extractEntityFromMessage(message: string): string {
  const match = message.match(/"(.+?)"/);
  return match?.[1] ?? 'Entity';
}

export default generateNotFoundErrorMsg;