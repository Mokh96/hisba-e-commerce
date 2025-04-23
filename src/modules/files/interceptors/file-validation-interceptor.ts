import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileRules } from '../types/file-validation.type';
import { validateFileCount, validateFileSize, validateFileType } from 'src/common/utils/file.util';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly rules: FileRules) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files: { [fieldname: string]: Express.Multer.File[] } = request.files || {}; // Ensure `files` is an object

    for (const fieldName in this.rules) {
      const { allowedTypes, maxSize, minCount, maxCount } = this.rules[fieldName];
      const uploadedFiles = files[fieldName] || []; // Default to an empty array if no files are uploaded

      validateFileCount({ fieldName, uploadedFiles, minCount, maxCount });

      uploadedFiles.forEach((file) => {
        validateFileType({ fieldName, file, allowedTypes });
        validateFileSize({ fieldName, file, maxSize });
      });
    }

    return next.handle();
  }
}
