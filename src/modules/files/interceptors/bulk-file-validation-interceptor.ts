import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileUploadEnum } from '../../files/enums/file-upload.enum';
import { extractFileTypeAndEntityId } from '../../files/utils/file-upload.util';
import { FileRules, FileValidationRules } from 'src/modules/files/types/file-validation.type';

const createDefaultFileMap = (): Record<FileUploadEnum, number> => ({
  [FileUploadEnum.Files]: 0,
  [FileUploadEnum.File]: 0,
  [FileUploadEnum.DefaultImage]: 0,
  [FileUploadEnum.Image]: 0,
  [FileUploadEnum.Images]: 0,
  [FileUploadEnum.Pdf]: 0,
});

@Injectable()
export class BulkFileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly rules: FileRules,
    private readonly entityField: string, // e.g., 'categories'
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files: Express.Multer.File[] = request.files || [];
    const entities: { _uid: string }[] = request.body[this.entityField]; // Expecting an array of entities
    //console.log(entities);

    if (!Array.isArray(entities) || entities.length === 0) {
      throw new BadRequestException(`Invalid ${this.entityField}: expected an array.`);
    }

    // Map to track files uploaded per entity
    const entityFileMap = new Map<string, Record<FileUploadEnum, number>>();

    // Process uploaded files
    files.forEach((file) => {
      const [fileType, entityId] = extractFileTypeAndEntityId(file.fieldname);

      // Initialize entity file tracking
      if (!entityFileMap.has(entityId)) {
        entityFileMap.set(entityId, createDefaultFileMap());
      }

      // Validate file type
      const rule = this.rules[fileType];
      if (!rule || !rule.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type for ${fileType}: ${file.mimetype}`);
      }

      // Validate file size
      if (file.size > rule.maxSize) {
        throw new BadRequestException(`File ${file.originalname} exceeds max size of ${rule.maxSize / 1024 / 1024}MB`);
      }

      // Count the uploaded file for this entity
      entityFileMap.get(entityId)![fileType]++;
    });

    //console.log('entityFileMap', entityFileMap);

    // Validate that each entity meets the minimum/maximum file count requirements
    entities.forEach((entity , index) => {
      const entityId = entity._uid || index.toString();
      const fileCounts = entityFileMap.get(entityId) || createDefaultFileMap();

      Object.keys(this.rules).forEach((fileType) => {
        const rule: FileValidationRules = this.rules[fileType];

        if (rule.minCount && rule.minCount > 0 && fileCounts[fileType] < rule.minCount) {
          throw new BadRequestException(
            `${this.entityField}[${entityId}] must have at least ${rule.minCount} ${fileType} file(s).`,
          );
        }

        if (rule.maxCount && fileCounts[fileType] > rule.maxCount) {
          throw new BadRequestException(
            `${this.entityField}[${entityId}] cannot have more than ${rule.maxCount} ${fileType} file(s).`,
          );
        }
      });
    });

    return next.handle();
  }
}
