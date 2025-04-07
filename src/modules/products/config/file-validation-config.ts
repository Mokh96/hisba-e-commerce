import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

export const createProductValidationRules: ValidationRules = {
  entity: 'products', //main entity
  files: {
    [FileUploadEnum.DefaultImage]: {
      ...imageUploadRules,
      required: true,
      minCount: 1,
    },
    [FileUploadEnum.Image]: imageUploadRules,
  },
  subItems: {
    articles: {
      files: {
        [FileUploadEnum.DefaultImage]: {
          ...imageUploadRules,
          required: true,
        },
      },
    },
  },
} as const;

const productValidationRulesInterceptor = new DynamicFileValidationInterceptor(createProductValidationRules);
export { productValidationRulesInterceptor };
