import { FileValidationRules } from 'src/modules/files/types/file-validation.type';

export interface ValidationRules {
  entity: 'products' | 'articles';
  files: Record<string, FileValidationRules>;
  subItems?: Record<string, Omit<ValidationRules, 'entity'>>;
}