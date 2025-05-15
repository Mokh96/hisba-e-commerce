import { Module } from '@nestjs/common';
import { I18nModule as I18nModuleLib } from 'nestjs-i18n';
import { ConfigService, ConfigType } from '@nestjs/config';
import i18nConfig, { I18N_CONFIG_KEY } from 'src/core/config/i18n.config';

@Module({
  imports: [
    I18nModuleLib.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const i18nConfigSettings = configService.get<ConfigType<typeof i18nConfig>>(I18N_CONFIG_KEY);
        return {
          fallbackLanguage: i18nConfigSettings.fallbackLanguage,
          loaderOptions: i18nConfigSettings.loaderOptions,
          loader: i18nConfigSettings.loader,
          resolvers: i18nConfigSettings.resolvers || [],
          typesOutputPath: i18nConfigSettings.typesOutputPath,
        };
      },
    }),
  ],
  exports: [I18nModule],
})
export class I18nModule {}
