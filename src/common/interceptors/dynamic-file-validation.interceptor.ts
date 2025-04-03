import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { FileValidationRules } from 'src/modules/files/types/file-validation.type';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';

@Injectable()
export class DynamicFileValidationInterceptor implements NestInterceptor {
  constructor(private readonly rules: ValidationRules) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
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

  private validateEntity(entity: any, files: Express.Multer.File[], rules: ValidationRules, path: string) {
    if (!entity._uid) {
      throw new BadRequestException(`Missing _uid in ${path}`);
    }

    this.validateEntityFiles(entity, files, rules.files, path);

    // Validate sub-items recursively
    if (rules.subItems) {
      Object.keys(rules.subItems).forEach((subItemKey) => {
        if (entity[subItemKey]) {
          const subEntities = Array.isArray(entity[subItemKey]) ? entity[subItemKey] : [entity[subItemKey]];

          subEntities.forEach((subEntity, index) => {
            this.validateEntity(
              subEntity,
              files,
              rules.subItems![subItemKey] as any,
              `${path}.${subItemKey}[${index}]`,
            );
          });
        }
      });
    }
  }

  private validateEntityFiles(
    entity: any,
    files: Express.Multer.File[],
    fileRules: Record<string, FileValidationRules>,
    entityPath: string,
  ) {
    Object.keys(fileRules).forEach((fileType) => {
      const rule = fileRules[fileType];
      const matchingFiles = this.getFilesByType(files, fileType, entity._uid);

      if (rule.required && matchingFiles.length === 0) {
        throw new BadRequestException(`${fileType} is required for ${entityPath}`);
      }

      if (matchingFiles.length) {
        this.validateFiles(matchingFiles, rule, `${fileType} in ${entityPath}`);
      }
    });
  }

  private validateFiles(files: Express.Multer.File[], rule: FileValidationRules, context: string) {
    if (files.length < (rule.minCount || 0) || files.length > (rule.maxCount || Infinity)) {
      throw new BadRequestException(
        `${context}: Expected between ${rule.minCount || 0} and ${rule.maxCount || '∞'} files, got ${files.length}`,
      );
    }

    files.forEach((file) => {
      if (!rule.allowedTypes.includes(file.mimetype as FileValidationRules['allowedTypes'][number])) {
        throw new BadRequestException(`${context}: Invalid file type ${file.mimetype}`);
      }

      if (file.size > rule.maxSize) {
        throw new BadRequestException(`${context}: File size exceeds limit (${rule.maxSize / 1024 / 1024} MB).`);
      }
    });
  }

  private getFilesByType(files: Express.Multer.File[], type: string, uid: string) {
    return files.filter((file) => file.fieldname === `${type}-${uid}`);
  }
}
