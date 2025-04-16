import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { imageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

const createArticleValidationRules: ValidationRules = {
  entity: 'articles', //main entity
  files: {
    [FileUploadEnum.Image]: { ...requiredImageUploadRules },
  },
};

const updateArticleValidationRules: ValidationRules = {
  entity: 'articles', //main entity
  files: {
    [FileUploadEnum.Image]: imageUploadRules,
  },
};

const createArticlesValidation = new DynamicFileValidationInterceptor(createArticleValidationRules);
const updateArticlesValidation = new DynamicFileValidationInterceptor(updateArticleValidationRules);

export { createArticlesValidation, updateArticlesValidation };
