import { Module, OnModuleInit } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule as I18nModuleLib, QueryResolver } from 'nestjs-i18n';
import { ConfigService, ConfigType } from '@nestjs/config';
import i18nConfig, { I18N_CONFIG_KEY } from 'src/core/config/i18n.config';
import { I18nService } from 'nestjs-i18n';
import { setI18nService } from './i18n.provider';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import * as path from 'path';

@Module({
  imports: [
    I18nModuleLib.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const i18nConfigSettings = configService.get<ConfigType<typeof i18nConfig>>(I18N_CONFIG_KEY);
        return {
          fallbackLanguage: i18nConfigSettings.fallbackLanguage,
          loaderOptions: {
            path: path.resolve(process.cwd(), 'i18n'),
            watch: i18nConfigSettings.watch,
          },
          typesOutputPath: path.join(process.cwd(), 'src', 'startup', 'i18n', 'generated', 'i18n.generated.ts'),
        };
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [],
})
export class I18nModule implements OnModuleInit {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  onModuleInit() {
    setI18nService(this.i18n);
  }
}
