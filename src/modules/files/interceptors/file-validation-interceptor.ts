import {  CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileRules } from '../types/file-validation.type';
import { FileValidationException } from 'src/common/exceptions/custom-exceptions/file-validation.exception';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

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
      /*  throw new InputValidationException(
          fieldName,
          `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
        );*/

        throw new FileValidationException(
          fieldName,
          `Minimum ${minCount} file(s) required, but only ${uploadedFiles.length} provided.`,
          ErrorType.FileTooFew,
          {
            minCount,
            receivedCount: uploadedFiles.length,
          }
        );
      }

      // Max count validation
      if (maxCount !== undefined && uploadedFiles.length > maxCount) {
       /* throw new InputValidationException(
          fieldName,
          `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
        );*/
        throw new FileValidationException(
          fieldName,
          `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
          ErrorType.FileTooMany,
          {
            maxCount,
            receivedCount: uploadedFiles.length,
          }
        );
      }

      uploadedFiles.forEach((file) => {
        if (!allowedTypes.includes(file.mimetype)) {
          throw new FileValidationException(
            fieldName,
            `Invalid file type for ${fieldName}. Allowed types: ${allowedTypes.join(', ')}`,
            ErrorType.FileInvalidType,
            { receivedType: file.mimetype },
          );
        }

        //File size validation
        if (file.size > maxSize) {
         /* throw new InputValidationException(
            fieldName,
            `File ${file.originalname} exceeds max size of ${maxSize / 1024 / 1024}MB`,
          );*/

          throw new FileValidationException(
            fieldName,
            `File ${file.originalname} exceeds max size of ${maxSize / 1024 / 1024}MB`,
            ErrorType.FileTooLarge,
            {
              fileName: file.originalname,
              maxSize,
              receivedSize: file.size,
            }
          );
        }
      });
    }

    return next.handle();
  }
}
