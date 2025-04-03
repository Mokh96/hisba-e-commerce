import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove fields that are not interceptors the dto
      forbidNonWhitelisted: false, // throw error if the field is not interceptors the dto
      transform: true, // transform the value to the type of the dto
      transformOptions: {
        enableImplicitConversion: true, // convert the value to the type of the dto
      },
    }),
  );
  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
