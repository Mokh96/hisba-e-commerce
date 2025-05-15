import i18nConfig from 'src/core/config/i18n.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import databaseConfig from 'src/core/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [i18nConfig , databaseConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
