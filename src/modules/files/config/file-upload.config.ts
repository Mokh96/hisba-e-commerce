import { FileValidationRules } from '../types/file-validation.type';
import { allowedImageTypes, allowedPdfTypes, allowedThumbnailTypes } from '../constant/allowed-files.constant';
import { IMAGE_MAX_SIZE, PDF_MAX_SIZE, THUMBNAIL_MAX_SIZE } from '../constant/upload.constant';
import * as console from 'node:console';

export const imageUploadRules: FileValidationRules = {
  allowedTypes: [...allowedImageTypes],
  maxSize: IMAGE_MAX_SIZE,
  minCount: 0,
  maxCount: 1,
} as const;

export const requiredImageUploadRules: FileValidationRules = {
  ...imageUploadRules,
  minCount: 1,//to be required
} as const;

export const optionalImageUploadRules: FileValidationRules = {
  ...imageUploadRules,
  minCount: 0,// to be optional
} as const;

const thumbnailUploadRules: FileValidationRules = {
  allowedTypes: [...allowedThumbnailTypes],
  maxSize: THUMBNAIL_MAX_SIZE,
} as const;

export const optionalThumbnailUploadRules: FileValidationRules = {
  ...thumbnailUploadRules,
  minCount: 0,
  maxCount: 1,
} as const;
