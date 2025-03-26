import { Injectable, OnModuleInit } from '@nestjs/common';
import { existsSync, promises as fs, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
import { UploadFileType } from '../types/upload-file.type';
import { ensureDirectoryExists, getPath } from '../utils/file-upload.util';
import { ThumbnailManager } from './thumbnail-manager';
import { FileTypesEnum } from '../enums/file-types.enum';
import { MAX_FILES_PER_FOLDER, UPLOAD_ROOT_DIR } from '../constant/upload.constant';

/**
 * Service for managing file uploads including storage, organization, and cleanup.
 * Supports automatic file organization into folders and thumbnail generation.
 */
@Injectable()
export class UploadManager3 implements OnModuleInit {
  /**
   * Base directory for all uploads managed by this instance
   */
  private uploadBaseDir: string;
  /**
   * Type of files being managed (e.g., public, private)
   */
  private readonly fileType: FileTypesEnum;
  /**
   * Additional subdirectories for organizing uploads
   * Example: ['user', '123'] would create a subdirectory 'user/123' for uploads
   */
  private readonly subDir: string[];

  /**
   * Creates a new upload manager instance
   *
   * @param fileType - Category of files being managed (public/private)
   * @param subDir - Array of subdirectory names for organizing files
   * @param thumbnailManager - Optional service for generating thumbnails
   */
  constructor(
    fileType: FileTypesEnum,
    subDir: string[],
    private readonly thumbnailManager?: ThumbnailManager, //inject thumbnail manager
  ) {
    this.fileType = fileType;
    this.subDir = subDir;
  }

  /**
   * Initializes the upload manager by creating the necessary directory structure
   * Called automatically by NestJS when the module is initialized
   */
  onModuleInit() {
    // Construct the base directory path from configuration and inputs
    this.uploadBaseDir = join(UPLOAD_ROOT_DIR, this.fileType, ...this.subDir);
    // Ensure the directory exists before attempting any operations
    ensureDirectoryExists(this.uploadBaseDir);
  }

  /**
   * Uploads multiple files to the appropriate folders and generates thumbnails if configured
   *
   * @param files - Object containing file arrays mapped by field names
   * @param subDir
   * @returns Array of metadata for all successfully uploaded files
   */
  protected async uploadFiles(
    files: {
      [fieldName: string]: Express.Multer.File[];
    },
    subDir?: string[],
  ): Promise<UploadFileType[]> {
    const uploadedFiles: UploadFileType[] = [];

    // Process each field (e.g., 'image', 'document', etc.)
    for (const fieldName in files) {
      // Process each file within the field
      for (const file of files[fieldName]) {
        try {
          // Get the appropriate folder for storage based on current capacity
          const currentFolder = this.getCurrentUploadFolder(subDir);
          ensureDirectoryExists(currentFolder);

          // Generate a unique filename with timestamp and random number
          const ext = extname(file.originalname);
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const fullPath = join(currentFolder, filename).toString();

          // Write the file to disk
          await fs.writeFile(fullPath, file.buffer);

          // Generate thumbnail if a thumbnail manager is provided and the file is compatible
          const thumbnail = await this.thumbnailManager?.createThumbnail(currentFolder, file, fullPath);

          // Create metadata record for the uploaded file
          uploadedFiles.push({
            filename,
            path: getPath(fullPath), // Relative path for external use
            fieldname: file.fieldname,
            fullPath,
            originalname: file.originalname,
            mimetype: file.mimetype,
            encoding: file.encoding,
            size: file.size,
            thumbnail,
          });
        } catch (error) {
          console.error(`Error uploading file: ${file.originalname}, Field: ${fieldName}`, error);
        }
      }
    }

    return uploadedFiles;
  }

  /**
   * Deletes all files interceptors the provided array, including their thumbnails
   * Used for cleanup interceptors case of failed operations
   *
   * @param uploadedFiles - Array of file metadata for files to be deleted
   */
  protected async cleanupFiles(uploadedFiles: UploadFileType[]) {
    for (const file of uploadedFiles) {
      // Delete the original file
      await this.cleanupFile(file.fullPath);

      // Delete thumbnail if it exists
      if (file.thumbnail && file.thumbnail.fullPath) {
        await this.cleanupFile(file.thumbnail.fullPath);
      }
    }
  }

  /**
   * Deletes a single file from the filesystem
   *
   * @param fullPath - Absolute path to the file that should be deleted
   */
  private async cleanupFile(fullPath: string) {
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(`Failed to delete file: ${fullPath}`, error);
    }
  }

  /**
   * Determines the appropriate folder for storing new uploads
   * Uses a numbered folder system with a maximum number of files per folder
   *
   * @returns Path to the folder where new files should be stored
   */
  private getCurrentUploadFolder(subDir?: string[]): string {
    let folderIndex = this.getCurrentFolderIndex(subDir);
    //return join(this.uploadBaseDir, ...(subDir || []), folderIndex.toString());
    return this.getFolderPath(folderIndex, subDir);
  }

  /**
   * Determines the current folder index based on folder capacity
   *
   * @returns The index of the folder where new files should be stored
   */
  private getCurrentFolderIndex(subDir?: string[]): number {
    let folderIndex = 1;
    //let folderPath = join(this.uploadBaseDir, ...(subDir || []), folderIndex.toString());
    let folderPath = this.getFolderPath(folderIndex, subDir);

    // Check existing folders until finding one with available capacity
    while (existsSync(folderPath)) {
      // Count actual files (excluding directories) interceptors the folder
      const filesCount = readdirSync(folderPath).filter((file) => statSync(join(folderPath, file)).isFile()).length;

      // If this folder has space, use it
      if (filesCount < MAX_FILES_PER_FOLDER) {
        return folderIndex;
      }

      // Otherwise, check the next folder
      folderIndex++;
      //folderPath = join(this.uploadBaseDir, folderIndex.toString());
      folderPath = this.getFolderPath(folderIndex, subDir);
    }

    // If we get here, we need a new folder
    ensureDirectoryExists(folderPath);
    return folderIndex;
  }

  private getFolderPath(folderIndex: number, subDir?: string[]): string {
    return join(this.uploadBaseDir, ...(subDir || []), folderIndex.toString());
  }
}
