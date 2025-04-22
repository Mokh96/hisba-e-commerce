import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed-exception/query-failed-exception.filter';
import { GlobalExceptionFilter } from 'src/error-handlers/global-handler';
import { NotFoundExceptionFilter } from 'src/common/exceptions/filters/entity-not-found-exception.filter';
import { ValidationExceptionFilter } from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-filter';
import { InputValidationFilter } from 'src/common/exceptions/filters/input-validation.exception.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: InputValidationFilter },
  ],
})
export class ExceptionModule {}
