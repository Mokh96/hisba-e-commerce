import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';


/**
 * @description
 * Decorator that applies **required** image upload handling to a controller route.
 *
 * It sets up:
 * - `FileFieldsInterceptor` to expect an image upload with the field name `'image'`
 * - `FileValidationInterceptor` to validate the uploaded image based on `requiredImageUploadRules`
 *
 * This decorator should be used when the image field is **mandatory** for the endpoint.
 *
 * @example
 * ```ts
 * @Post()
 * @UseRequiredImageUpload()
 * create(
 *   @Body() dto: CreateBrandDto,
 *   @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
 * ) {
 *   return this.brandsService.create(dto, files);
 * }
 * ```
 *
 * @returns A combined decorator applying the required image upload interceptors.
 */
export function UseRequiredImageUpload() {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
      new FileValidationInterceptor({
        [FileUploadEnum.Image]: requiredImageUploadRules,
      }),
    ),
  );
}
