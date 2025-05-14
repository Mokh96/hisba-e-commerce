import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { optionalImageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

const createBrandValidationRules: ValidationRules = {
  entity: 'brands',
  files: {
    [FileUploadEnum.Image]: optionalImageUploadRules,
  },
};

const updateBrandValidationRules: ValidationRules = {
  entity: 'brands',
  files: {
    [FileUploadEnum.Image]: optionalImageUploadRules,
  },
};

const createBrandsValidation = new DynamicFileValidationInterceptor(createBrandValidationRules);
const updateBrandsValidation = new DynamicFileValidationInterceptor(updateBrandValidationRules);

export { createBrandsValidation, updateBrandsValidation };
