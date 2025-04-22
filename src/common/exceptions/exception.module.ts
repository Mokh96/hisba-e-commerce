import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed-exception/query-failed-exception.filter';
import { GlobalExceptionFilter } from 'src/error-handlers/global-handler';
import { NotFoundExceptionFilter } from 'src/common/exceptions/filters/entity-not-found-exception.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
  ],
})
export class ExceptionModule {}
