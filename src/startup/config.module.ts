import i18nConfig from 'src/core/config/i18n.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [i18nConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
