import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { FileValidationRules } from 'src/modules/files/types/file-validation.type';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { SyncedEntity } from 'src/common/types/global.type';
import InputValidationException from 'src/common/exceptions/custom-exceptions/input-validation.exception';
import { formatFileSize } from 'src/common/utils/file.util';
import { FileValidationException } from 'src/common/exceptions/custom-exceptions/file-validation.exception';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';

@Injectable()
export class DynamicFileValidationInterceptor implements NestInterceptor {
  constructor(private readonly rules: ValidationRules) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const files = request.files as Express.Multer.File[];
    const body = request.body;

    if (!body) {
      throw new BadRequestException('Request body is required.');
    }

    // Convert the main object to an array if necessary
    const dataArray = Array.isArray(body) ? body : [body];

    // Validate each entity
    dataArray.forEach((item, index) => {
      this.validateEntity(item, files, this.rules, `[${this.rules.entity}][${index}]`);
    });

    return next.handle();
  }

  private validateEntity<T extends SyncedEntity>(
    entity: T,
    files: Express.Multer.File[],
    rules: ValidationRules,
    path: string,
  ) {
    if (!entity.syncId) {
      throw new BadRequestException(`Missing syncId in ${path}`);
    }

    this.validateEntityFiles(entity, files, rules.files, path);

    // Validate subItems recursively
    if (rules.subItems) {
      Object.keys(rules.subItems).forEach((subItemKey) => {
        if (entity[subItemKey]) {
          const subEntities = Array.isArray(entity[subItemKey]) ? entity[subItemKey] : [entity[subItemKey]];

          subEntities.forEach((subEntity, index) => {
            this.validateEntity(
              subEntity,
              files,
              rules.subItems![subItemKey] as any, //todo remove any
              `${path}.${subItemKey}[${index}]`,
            );
          });
        }
      });
    }
  }

  private validateEntityFiles(
    entity: SyncedEntity,
    files: Express.Multer.File[],
    fileRules: Record<string, FileValidationRules>,
    entityPath: string,
  ) {
    Object.keys(fileRules).forEach((fileType) => {
      const rule = fileRules[fileType];
      const matchingFiles = this.getFilesByType(files, fileType, entity.syncId);
      const isRequired = rule.minCount > 0;

      if (isRequired && matchingFiles.length === 0) {
        //example :image is required for [categories][1]
        //throw new InputValidationException(fileType, `${fileType} is required for ${entityPath}`);

        throw new FileValidationException(
          entityPath,
          `${fileType} is required for ${entityPath}`,
          ErrorType.FileTooFew,
          {
            fileType,
            entityPath,
          },
        );
      }

      if (matchingFiles.length) {
        //this.validateFiles(matchingFiles, rule, `${fileType} in ${entityPath}`);
        this.validateFiles(matchingFiles, rule, fileType, entityPath);
      }
    });
  }

  private validateFiles(files: Express.Multer.File[], rule: FileValidationRules, fileType: string, entityPath: string) {
    const context = `${fileType} in ${entityPath}`;

    // private validateFiles(files: Express.Multer.File[], rule: FileValidationRules, context: string) {
    if (files.length < (rule.minCount || 0) || files.length > (rule.maxCount || Infinity)) {
      /* throw new InputValidationException(
         fileType,
         `${context}: Expected between ${rule.minCount || 0} and ${rule.maxCount || '∞'} files, got ${files.length}`,
       );*/

      throw new FileValidationException(
        entityPath,
        `${context}: Expected between ${rule.minCount || 0} and ${rule.maxCount || '∞'} files, got ${files.length}`,
        ErrorType.FileTooFew,
        {
          fileType,
          entityPath,
          minCount: rule.minCount,
          maxCount: rule.maxCount,
          receivedCount: files.length,
        },
      );
    }

    files.forEach((file) => {
      if (!rule.allowedTypes.includes(file.mimetype as FileValidationRules['allowedTypes'][number])) {
        //throw new InputValidationException(fileType, `${context}: Invalid file type ${file.mimetype}`);
        throw new FileValidationException(
          entityPath,
          `${context}: Invalid file type ${file.mimetype}. Allowed types: ${rule.allowedTypes.join(', ')}`,
          ErrorType.FileInvalidType,
          {
            fileType,
            entityPath,
            receivedType: file.mimetype,
            allowedTypes: rule.allowedTypes,
          },
        );
      }

      if (file.size > rule.maxSize) {
        /*   throw new InputValidationException(
             fileType,
             `${context}: File size exceeds limit (${formatFileSize(rule.maxSize)}).`,
           );*/

        throw new FileValidationException(
          entityPath,
          `${context}: File size exceeds limit (${formatFileSize(rule.maxSize)}).`,
          ErrorType.FileTooLarge,
          {
            fileType,
            entityPath,
            receivedSize: formatFileSize(file.size),
            maxSize: formatFileSize(rule.maxSize),
          },
        );
      }
    });
  }

  private getFilesByType(files: Express.Multer.File[], type: string, syncId: SyncedEntity['syncId']) {
    return files.filter((file) => file.fieldname === `${type}-${syncId}`);
  }
}
