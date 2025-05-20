import { HttpStatus } from '@nestjs/common';
import { translate } from 'src/startup/i18n/i18n.provider';
import { I18nMsgType } from 'src/startup/i18n/i18n.types';

function getErrorTitle(status: HttpStatus): I18nMsgType {
  const titles: Record<number, I18nMsgType> = {
    [HttpStatus.BAD_REQUEST]: translate('errors.badRequest'),
    [HttpStatus.REQUEST_TIMEOUT]: translate('errors.requestTimeout'),
    [HttpStatus.UNAUTHORIZED]: translate('errors.unauthorizedAccess'),
    [HttpStatus.FORBIDDEN]: translate('errors.forbiddenAccess'),
    [HttpStatus.NOT_FOUND]: translate('errors.notFound'),
    [HttpStatus.CONFLICT]: translate('errors.conflict'),
    [HttpStatus.UNPROCESSABLE_ENTITY]: translate('errors.unprocessableEntity'),
    [HttpStatus.TOO_MANY_REQUESTS]: translate('errors.tooManyRequests'),
    [HttpStatus.INTERNAL_SERVER_ERROR]: translate('errors.internalServerError'),
  };
  return titles[status] ?? translate('errors.error');
}

export default getErrorTitle;
