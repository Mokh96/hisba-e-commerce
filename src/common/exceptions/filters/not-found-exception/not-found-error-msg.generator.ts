import { EntityNotFoundError } from 'typeorm';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import createErrorResponse from 'src/common/exceptions/helpers/create-error-response.helper';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';
import { translate } from 'src/startup/i18n/i18n.provider';

function generateNotFoundErrorMsg(exception: EntityNotFoundError | NotFoundException): ApiErrorResponse {
  const status = HttpStatus.NOT_FOUND;
  const entity = extractEntityFromMessage(exception.message) as string;

  const d = translate('errors.entityNotFound', { args: { entity } })
  return createErrorResponse({
    statusCode: status,
    message: translate('errors.entityNotFound', { args: { entity } }) as string,
    type: ErrorType.EntityNotFound,
    errors: [
      {
        field: entity.toLowerCase(),
        message: translate('errors.entityDoesNotExist', { args: { entity } }) as string,
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
  return match?.[1] ?? translate('errors.defaultEntity') as string;
}

export default generateNotFoundErrorMsg;
