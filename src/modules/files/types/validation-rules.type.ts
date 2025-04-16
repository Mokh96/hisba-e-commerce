import { FileValidationRules } from 'src/modules/files/types/file-validation.type';

export interface ValidationRules {
  entity: 'products' | 'articles' | 'brands';
  files: Record<string, FileValidationRules>;
  subItems?: Record<string, Omit<ValidationRules, 'entity'>>;
}
