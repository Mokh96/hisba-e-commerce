/**
 * Finds a file interceptors an array of files by its unique identifier (syncId) and a prefix fieldname.
 * @param files - Array of files
 * @param prefixFieldname - Prefix of the fieldname (e.g. 'DefaultImage', 'Image')
 * @param syncId Unique identifier of the file
 * @returns File if found, undefined if not
 * @example
 * const files: Express.Multer.File[] = [
 *   { fieldname: 'DefaultImage-123', ... } as Express.Multer.File,
 *   { fieldname: 'Image-123', ... } as Express.Multer.File,
 * ];
 * const file = getFileBySyncId(files, FileUploadEnum.DefaultImage, '123');
 * console.log(file); // Logs the default image file with syncId '123'
 */
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { SyncedEntity } from 'src/common/types/global.type';

export function getFileBySyncId(
  files: Express.Multer.File[],
  prefixFieldname: FileUploadEnum,
  syncId: SyncedEntity['syncId'],
): Express.Multer.File | undefined {
  if (!files) return undefined;
  return files.find((file) => file.fieldname === `${prefixFieldname}-${syncId}`);
}

/**
 * Retrieves all files interceptors an array that match a specific unique identifier (syncId) and a prefix fieldname.
 * @param files - Array of files
 * @param prefixFieldname - Prefix of the fieldname (e.g. 'DefaultImage', 'Image')
 * @param syncId - Unique identifier of the file
 * @returns Array of files that match the criteria
 * @example
 * const files: Express.Multer.File[] = [
 *   { fieldname: 'DefaultImage-123', ... } as Express.Multer.File,
 *   { fieldname: 'Image-456', ... } as Express.Multer.File,
 *   { fieldname: 'DefaultImage-789', ... } as Express.Multer.File,
 * ];
 * const matchedFiles = getFilesBySyncId(files, FileUploadEnum.DefaultImage, '123');
 * console.log(matchedFiles); // Logs array containing the file with fieldname 'DefaultImage-123'
 */
export function getFilesBySyncId(
  files: Express.Multer.File[],
  prefixFieldname: FileUploadEnum,
  syncId: SyncedEntity['syncId'],
): Express.Multer.File[] {
  if(!files) return [];
  return files.filter((file) => file.fieldname === `${prefixFieldname}-${syncId}`);
}
