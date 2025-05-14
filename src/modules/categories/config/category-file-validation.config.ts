import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { optionalImageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

const createCategoryValidationRules: ValidationRules = {
  entity: 'categories',
  files: {
    [FileUploadEnum.Image]: optionalImageUploadRules,
  },
};

const updateCategoryValidationRules: ValidationRules = {
  entity: 'categories',
  files: {
    [FileUploadEnum.Image]: optionalImageUploadRules,
  },
};

const createCategoriesValidation = new DynamicFileValidationInterceptor(createCategoryValidationRules);
const updateCategoriesValidation = new DynamicFileValidationInterceptor(updateCategoryValidationRules);

export { createCategoriesValidation, updateCategoriesValidation };