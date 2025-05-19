import { FileUploadEnum } from '../enums/file-upload.enum';
import { AllowedImageType, AllowedPdfType, AllowedThumbnailType } from '../constant/allowed-files.constant';

export type FileValidationRules = {
  //required?: boolean;
  allowedTypes: (AllowedImageType | AllowedPdfType | AllowedThumbnailType)[];
  maxSize: number; // Max file size interceptors bytes
  minCount?: number; // Minimum number of files required
  maxCount?: number; // Maximum number of files allowed
};

export type FileRules = Partial<Record<FileUploadEnum, FileValidationRules>>;
