/**
 * Finds a file interceptors an array of files by its unique identifier (uid) and a prefix fieldname.
 * @param files - Array of files
 * @param prefixFieldname - Prefix of the fieldname (e.g. 'DefaultImage', 'Image')
 * @param uid - Unique identifier of the file
 * @returns File if found, undefined if not
 * @example
 * const files: Express.Multer.File[] = [
 *   { fieldname: 'DefaultImage-123', ... } as Express.Multer.File,
 *   { fieldname: 'Image-123', ... } as Express.Multer.File,
 * ];
 * const file = this.getFileByUid(files, FileUploadEnum.DefaultImage, '123');
 * console.log(file); // Logs the default image file with uid '123'
 */
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';

export function getFileByUid(
  files: Express.Multer.File[],
  prefixFieldname: FileUploadEnum,
  uid: string,
): Express.Multer.File | undefined {
  if (!files) return undefined;
  return files.find((file) => file.fieldname === `${prefixFieldname}-${uid}`);
}

/**
 * Retrieves all files interceptors an array that match a specific unique identifier (uid) and a prefix fieldname.
 * @param files - Array of files
 * @param prefixFieldname - Prefix of the fieldname (e.g. 'DefaultImage', 'Image')
 * @param uid - Unique identifier of the file
 * @returns Array of files that match the criteria
 * @example
 * const files: Express.Multer.File[] = [
 *   { fieldname: 'DefaultImage-123', ... } as Express.Multer.File,
 *   { fieldname: 'Image-456', ... } as Express.Multer.File,
 *   { fieldname: 'DefaultImage-789', ... } as Express.Multer.File,
 * ];
 * const matchedFiles = this.getFilesByUid(files, FileUploadEnum.DefaultImage, '123');
 * console.log(matchedFiles); // Logs array containing the file with fieldname 'DefaultImage-123'
 */
export function getFilesByUid(
  files: Express.Multer.File[],
  prefixFieldname: FileUploadEnum,
  uid: string,
): Express.Multer.File[] {
  if(!files) return [];
  return files.filter((file) => file.fieldname === `${prefixFieldname}-${uid}`);
}
