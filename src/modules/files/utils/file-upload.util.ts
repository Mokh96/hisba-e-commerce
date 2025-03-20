import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { UPLOAD_ROOT_DIR } from '../constant/upload.constant';
import { FileUploadEnum } from '../enums/file-upload.enum';

/**
 * Creates a directory recursively if it does not exist.
 *
 * @param dirPath - The path to the directory.
 */
export function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Returns the relative path from the root upload directory.
 *
 * Replaces backslashes with forward slashes to ensure a consistent path
 * separator across different operating systems.
 *
 * @example
 * fullPath = uploads\\private\\categories\\1\\1742030622816-865088721.jpg
 * getPath(fullPath) = private/categories/1/1742030622816-865088721.jpg
 *
 * @param fullPath - The full path to the file.
 */
export function getPath(fullPath: string): string {
  return fullPath.replace(/\\/g, '/').split(`${UPLOAD_ROOT_DIR}/`)[1];
}

/**
 * Extracts the file type and entity ID from a file field name.
 *
 * **Example Usage:**
 * ```typescript
 * extractFileTypeAndEntityId('image-12345'); // Returns ['image', '12345']
 * extractFileTypeAndEntityId('pdf-67890'); // Returns ['pdf', '67890']
 * extractFileTypeAndEntityId('invalid-123'); // Throws BadRequestException
 * ```
 *
 * **Expected Format:** `{fileType}-{entityId}`
 * - `fileType` must be one of the allowed types in `FileUploadEnum`.
 * - `entityId` can be any valid identifier.
 *
 * @param fieldname - The file field name to extract info from.
 * @returns A tuple `[fileType, entityId]`, where:
 *   - `fileType` is a valid type from `FileUploadEnum`.
 *   - `entityId` is the corresponding entity identifier.
 * @throws {BadRequestException} If the field name format is invalid.
 */
export function extractFileTypeAndEntityId(fieldname: string) {
  const allowedTypes = Object.values(FileUploadEnum).join('|'); // Dynamically construct regex
  const match = fieldname.match(new RegExp(`^(${allowedTypes})-(.+)$`));

  if (!match) {
    throw new BadRequestException(`Unexpected file field: ${fieldname}`);
  }

  return [match[1], match[2]]; //fileType, entityId
}
