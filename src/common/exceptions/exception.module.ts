import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed-exception/query-failed-exception.filter';
import { ServerExceptionFilter } from 'src/common/exceptions/filters/server-exception/server-exception';
import { NotFoundExceptionFilter } from 'src/common/exceptions/filters/not-found-exception/not-found-exception.filter';
import { BadRequestExceptionFilter } from 'src/common/exceptions/filters/bad-request-exception/bad-request-exception-filter';
import { InputValidationFilter } from 'src/common/exceptions/filters/input-validation.exception.filter';
import { FileValidationFilter } from 'src/common/exceptions/filters/file-validation.filter';
import { UnauthorizedExceptionFilter } from 'src/common/exceptions/filters/unauthorized-exception/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from 'src/common/exceptions/filters/forbidden-exception/forbidden-exception.filter';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import {
  I18nValidationExceptionFilter
} from 'src/common/exceptions/filters/bad-request-exception/i18n-validation-exception.filter';
import { ConfigService, ConfigType } from '@nestjs/config';
import i18nConfig from 'src/core/config/i18n.config';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: ServerExceptionFilter },
    { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    //{ provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    {
      provide: APP_FILTER,
      useFactory: (
        i18nService: I18nService<I18nTranslations>,
        configService: ConfigService,
      ) => {
        const i18nConfiguration = configService.get<ConfigType<typeof i18nConfig>>('i18n');
        return new I18nValidationExceptionFilter(i18nService, i18nConfiguration);
      },
      inject: [I18nService, ConfigService],
    },
    { provide: APP_FILTER, useClass: InputValidationFilter },
    { provide: APP_FILTER, useClass: FileValidationFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },//
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },//
  ],
})
export class ExceptionModule {}
