import { ValidationRules } from 'src/modules/files/types/validation-rules.type';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { optionalImageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { DynamicFileValidationInterceptor } from 'src/common/interceptors/dynamic-file-validation.interceptor';

const createFamilyValidationRules: ValidationRules = {
  entity: 'families', //main entity
  files: {
    [FileUploadEnum.Image]: requiredImageUploadRules,
  },
};

const updateFamilyValidationRules: ValidationRules = {
  entity: 'families', //main entity
  files: {
    [FileUploadEnum.Image]: optionalImageUploadRules,
  },
};

const createFamiliesValidation = new DynamicFileValidationInterceptor(createFamilyValidationRules);
const updateFamiliesValidation = new DynamicFileValidationInterceptor(updateFamilyValidationRules);

export { createFamiliesValidation, updateFamiliesValidation };
