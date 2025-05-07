import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseFormDataArrayInterceptor } from 'src/common/interceptors/parse-form-data-array.interceptor';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/validate-bulk-dto.Interceptor';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

/**
 * @description
 * Decorator to apply all necessary interceptors for bulk upload routes.
 *
 * This includes:
 * - `AnyFilesInterceptor`: to support any number of uploaded files
 * - `ParseFormDataArrayInterceptor`: to parse JSON arrays from `multipart/form-data`
 * - `ValidateBulkDtoInterceptor`: validates the structure of the array items against the provided DTO class
 * - Custom validation pipe: further validates using a class-validator pipe or rule set
 *
 * @param dto - The DTO class to validate the bulk body array (e.g. `UpdateSyncBrandsDto`)
 * @param validationPipe - A pre-configured instance of `DynamicFileValidationInterceptor` to validate files per DTO
 *
 * @example
 * ```ts
 * @Post('/bulk')
 * @UseBulkUpload(CreateSyncBrandDto, createBrandsValidation)
 * async createBulk(...) {}
 * ```
 */
export function UseBulkUpload<T extends object>(dto: Type<T>, validationPipe: DynamicFileValidationInterceptor) {
  return applyDecorators(
    UseInterceptors(
      AnyFilesInterceptor(),
      ParseFormDataArrayInterceptor,
      new ValidateBulkDtoInterceptor(dto),
      validationPipe,
    ),
  );
}
