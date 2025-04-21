import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { optionalImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';


/**
 * @description
 * Decorator that applies optional image upload handling to a controller route.
 *
 * It sets up:
 * - `FileFieldsInterceptor` to accept an optional image upload with field name `'image'`
 * - `FileValidationInterceptor` to validate the uploaded image based on predefined rules
 *
 * This decorator is useful when the image field is optional and you want to avoid repeating logic.
 *
 * @example
 * ```ts
 * @Post()
 * @UseOptionalImageUpload()
 * create(
 *   @Body() dto: CreateBrandDto,
 *   @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
 * ) {
 *   return this.brandsService.create(dto, files);
 * }
 * ```
 *
 * @returns A combined decorator applying the file upload interceptors.
 */
export function UseOptionalImageUpload() {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
      new FileValidationInterceptor({
        [FileUploadEnum.Image]: { ...optionalImageUploadRules },
      }),
    ),
  );
}


