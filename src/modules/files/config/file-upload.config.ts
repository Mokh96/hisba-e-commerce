import { FileValidationRules } from '../types/file-validation.type';
import { allowedImageTypes, allowedPdfTypes } from '../constant/allowed-files.constant';
import { IMAGE_MAX_SIZE, PDF_MAX_SIZE } from '../constant/upload.constant';

export const imageUploadRules: FileValidationRules = {
  required: false,
  allowedTypes: [...allowedImageTypes],
  maxSize: IMAGE_MAX_SIZE,
  minCount: 0,
  maxCount: 1,
} as const ;

export const pdfUploadRules: FileValidationRules = {
  required: false,
  allowedTypes: [...allowedPdfTypes],
  maxSize: PDF_MAX_SIZE,
  minCount: 1,
  maxCount: 1,
} as const;
