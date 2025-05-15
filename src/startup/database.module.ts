import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Module } from '@nestjs/common';
import databaseConfig, { DATABASE_CONFIG_KEY } from 'src/core/config/database.config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<ConfigType<typeof databaseConfig>>(DATABASE_CONFIG_KEY);
        return {
          type: dbConfig.type as MysqlConnectionOptions['type'],
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          autoLoadEntities: dbConfig.autoLoadEntities,
          synchronize: dbConfig.synchronize,
          //logger: 'debug',
          //logging: ['query', 'error'],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
