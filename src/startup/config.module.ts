import i18nConfig from 'src/core/config/i18n.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import databaseConfig from 'src/core/config/database.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [i18nConfig, databaseConfig],
      validationSchema: Joi.object({
        //database
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        AUTO_LOAD_ENTITIES: Joi.boolean(),
        SYNCHRONIZE: Joi.boolean(),
        //jwt
        JWT_SECRET: Joi.required(),
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
