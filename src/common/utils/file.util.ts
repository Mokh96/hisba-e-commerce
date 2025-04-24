import { FileValidationException } from 'src/common/exceptions/custom-exceptions/file-validation.exception';
import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { FileValidationRules } from 'src/modules/files/types/file-validation.type';

export function formatFileSize(bytes: number) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  const precision = size < 10 ? 2 : size < 100 ? 1 : 0;

  return `${size.toFixed(precision)} ${units[i]}`;
}

export function validateFileCount(params: {
  fieldName: string;
  uploadedFiles: Express.Multer.File[];
  minCount?: number;
  maxCount?: number;
}): void {
  const { fieldName, uploadedFiles, minCount, maxCount } = params;

  if (minCount !== undefined && uploadedFiles.length < minCount) {
    throw new FileValidationException(
      fieldName,
      `Minimum ${minCount} file(s) required, but only ${uploadedFiles.length} provided.`,
      ErrorType.FileTooFew,
      {
        minCount,
        receivedCount: uploadedFiles.length,
      },
    );
  }

  if (maxCount !== undefined && uploadedFiles.length > maxCount) {
    throw new FileValidationException(
      fieldName,
      `Maximum ${maxCount} file(s) allowed for ${fieldName}, but ${uploadedFiles.length} provided.`,
      ErrorType.FileTooMany,
      {
        maxCount,
        receivedCount: uploadedFiles.length,
      },
    );
  }
}

export function validateFileType(params: {
  fieldName: string;
  file: Express.Multer.File;
  allowedTypes: FileValidationRules['allowedTypes'];
}): void {
  const { fieldName, file, allowedTypes } = params;

  if (!allowedTypes.includes(file.mimetype as FileValidationRules['allowedTypes'][number])) {
    throw new FileValidationException(
      fieldName,
      `Invalid file type for ${fieldName}. Allowed types: ${allowedTypes.join(', ')}`,
      ErrorType.FileInvalidType,
      { receivedType: file.mimetype },
    );
  }
}

export function validateFileSize(params: { fieldName: string; file: Express.Multer.File; maxSize: number }): void {
  const { fieldName, file, maxSize } = params;

  if (file.size > maxSize) {
    throw new FileValidationException(
      fieldName,
      `File ${file.originalname} exceeds max size of ${formatFileSize(maxSize)} (received: ${formatFileSize(
        file.size,
      )})`,
      ErrorType.FileTooLarge,
      {
        fileName: file.originalname,
        maxSize,
        receivedSize: file.size,
      },
    );
  }
}
