import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './filters/query-failed-exception/query-failed-exception.filter';
import { GlobalExceptionFilter } from 'src/common/exceptions/filters/global-handler';
import { NotFoundExceptionFilter } from 'src/common/exceptions/filters/entity-not-found-exception.filter';
import { ValidationExceptionFilter } from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-filter';
import { InputValidationFilter } from 'src/common/exceptions/filters/input-validation.exception.filter';
import { FileValidationFilter } from 'src/common/exceptions/filters/file-validation.filter';
import { UnauthorizedExceptionFilter } from 'src/common/exceptions/filters/unauthorized-exception.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: QueryFailedExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: InputValidationFilter },
    { provide: APP_FILTER, useClass: FileValidationFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
  ],
})
export class ExceptionModule {}
