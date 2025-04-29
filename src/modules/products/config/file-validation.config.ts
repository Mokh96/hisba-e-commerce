import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { imageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

export const createProductValidationRules: ValidationRules = {
  entity: 'products', //main entity
  files: {
    [FileUploadEnum.DefaultImage]: {
      ...requiredImageUploadRules,
    },
    [FileUploadEnum.Image]: { ...imageUploadRules, maxCount: 8 },
  },
  subItems: {
    articles: {
      files: {
        [FileUploadEnum.DefaultImage]: {
          ...imageUploadRules,
        },
      },
    },
  },
} as const;

const productValidationRulesInterceptor = new DynamicFileValidationInterceptor(createProductValidationRules);
export { productValidationRulesInterceptor };
