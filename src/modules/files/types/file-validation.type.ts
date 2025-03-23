import { FileUploadEnum } from '../enums/file-upload.enum';
import { AllowedImageType, AllowedPdfType } from '../constant/allowed-files.constant';

export type FileValidationRules = {
  allowedTypes: (AllowedImageType | AllowedPdfType)[];
  maxSize: number;// Max file size in bytes
  minCount?: number; // Minimum number of files required
  maxCount?: number; // Maximum number of files allowed
};

export type FileRules = Partial<Record<FileUploadEnum, FileValidationRules>>;