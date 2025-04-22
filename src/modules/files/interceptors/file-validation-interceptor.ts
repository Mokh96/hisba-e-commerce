import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileRules } from '../types/file-validation.type';
import InputValidationException from 'src/common/exceptions/custom-exceptions/input-validation.exception';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly rules: FileRules) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files: { [fieldname: string]: Express.Multer.File[] } = request.files || {}; // Ensure `files` is an object

    for (const fieldName in this.rules) {
      const { allowedTypes, maxSize, minCount, maxCount } = this.rules[fieldName];
      const uploadedFiles = files[fieldName] || []; // Default to an empty array if no files are uploaded

      // Min count validation
      if (minCount !== undefined && uploadedFiles.length < minCount) {
        throw new InputValidationException(
          fieldName,
          `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
        );
      }

      // Max count validation
      if (maxCount !== undefined && uploadedFiles.length > maxCount) {
        throw new InputValidationException(
          fieldName,
          `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
        );
      }

      uploadedFiles.forEach((file) => {
        //File type validation
        if (!allowedTypes.includes(file.mimetype)) {
          throw new InputValidationException(
            fieldName,
            `Invalid file type for ${fieldName}. Allowed types: ${allowedTypes.join(', ')}`,
          );
        }

        //File size validation
        if (file.size > maxSize) {
          throw new InputValidationException(
            fieldName,
            `File ${file.originalname} exceeds max size of ${maxSize / 1024 / 1024}MB`,
          );
        }
      });
    }

    return next.handle();
  }
}
