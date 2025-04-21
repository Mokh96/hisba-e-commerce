import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed-exception.filter';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import { GlobalExceptionFilter } from 'src/error-handlers/global-handler';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
    { provide: APP_FILTER, useClass: EntityNotFoundExceptionFilter },
  ],
})
export class ExceptionModule {}
