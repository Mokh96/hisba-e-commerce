import { FileValidationRules } from '../types/file-validation.type';
import { allowedImageTypes, allowedPdfTypes } from '../constant/allowed-files.constant';
import { IMAGE_MAX_SIZE, PDF_MAX_SIZE } from '../constant/upload.constant';
import * as console from 'node:console';

export const imageUploadRules: FileValidationRules = {
  //required: false,
  allowedTypes: [...allowedImageTypes],
  maxSize: IMAGE_MAX_SIZE,
  minCount: 0,
  maxCount: 1,
} as const;


export const requiredImageUploadRules: FileValidationRules = {
  ...imageUploadRules,
  //required: true,
  minCount: 1,
  maxCount: 3,
  maxSize: 120,
} as const;

export const optionalImageUploadRules: FileValidationRules = {
  ...imageUploadRules,
  //required: false,
  minCount: 0,
} as const;
