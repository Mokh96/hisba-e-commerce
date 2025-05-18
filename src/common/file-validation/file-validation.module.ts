import { Module, DynamicModule } from '@nestjs/common';
import {  I18nService } from 'nestjs-i18n';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import { DynamicFileValidationInterceptor } from 'src/common/file-validation/dynamic-file-validation.interceptor';
import { I18nModule } from 'src/startup/i18n/i18n.module';

@Module({})
export class FileValidationInterceptorModule {
  static register(rules: ValidationRules, token: symbol): DynamicModule {
    return {
      module: FileValidationInterceptorModule,
      providers: [
        {
          provide: token,
          useFactory: (i18n: I18nService<I18nTranslations>) => new DynamicFileValidationInterceptor(rules, i18n),
          inject: [I18nService],
        },
      ],
      exports: [token],
      imports: [I18nModule],
    };
  }
}
