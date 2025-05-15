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
        return { ...i18nConfigSettings };
      },
    }),
  ],
  exports: [I18nModule],
})
export class I18nModule {}
