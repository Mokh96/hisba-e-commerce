import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';

export const createProductValidationRules: ValidationRules = {
  entity: 'products', //main entity
  files: {
    [FileUploadEnum.Image]: {
      ...imageUploadRules,
      required: true,
      minCount: 1,
    },
  },
  subItems: {
    articles: {
      files: {
        [FileUploadEnum.DefaultImage]: {
          ...imageUploadRules,
          required: true,
        },
        [FileUploadEnum.Image]: imageUploadRules,
      },
    },
  },
};
