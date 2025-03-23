import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { basename, extname, join } from 'path';
import * as sharp from 'sharp';
import { ThumbnailOptions } from '../types/thumbnail.type';
import { ensureDirectoryExists, getPath } from '../utils/file-upload.util';
import { UploadFileType } from '../types/upload-file.type';
import { THUMBNAIL_FOLDER_NAME } from '../constant/upload.constant';

/**
 * Service responsible for generating and managing image thumbnails.
 * Handles thumbnail creation, configuration, and metadata extraction.
 */
@Injectable()
export class ThumbnailManager {
  /**
   * Configuration options for thumbnail generation including size and whether to generate thumbnails.
   */
  private thumbnailOptions: ThumbnailOptions;

  /**
   * Creates a new instance of ThumbnailManager.
   *
   * @param thumbnailOptions - Optional configuration for thumbnail generation.
   * If not provided, default settings will be used.
   */
  constructor(thumbnailOptions?: ThumbnailOptions) {
    //initial thumbnail options
    const defaultThumbnailOptions = {
      generateThumbnails: true,
      thumbnailSize: { height: 200, width: 200 },
    };

    // Merge default options with any provided options, with provided options taking precedence
    this.thumbnailOptions = { ...defaultThumbnailOptions, ...thumbnailOptions };
  }

  /**
   * Generates a thumbnail for the given image file.
   * Uses buffer-based processing to avoid file handle locking issues.
   *
   * @param currentFolder - The folder where the original image is located
   * @param fullPath - The full path to the original image file
   * @returns The path to the generated thumbnail or undefined if generation failed
   */
  private async generateThumbnail(currentFolder: string, fullPath: string): Promise<string | undefined> {
    // Maintain a reference to the Sharp instance for proper cleanup
    let sharpInstance: sharp.Sharp | null = null;

    try {
      // Extract filename components
      const ext = extname(fullPath);
      const filename = basename(fullPath, ext);

      // Create thumbnails directory if it doesn't exist
      const thumbnailsDir = join(currentFolder, THUMBNAIL_FOLDER_NAME);
      ensureDirectoryExists(thumbnailsDir);

      // Generate thumbnail filename and path
      const thumbFilename = `${filename}-thumb${ext}`;
      const thumbFullPath = join(thumbnailsDir, thumbFilename);

      // Extract thumbnail dimensions from options
      const { height, width } = this.thumbnailOptions.thumbnailSize!;

      // IMPORTANT: Read the file into a buffer first to avoid keeping the file handle open
      // This prevents EPERM errors when trying to delete the original file later
      const imageBuffer = await fs.readFile(fullPath);
      sharpInstance = sharp(imageBuffer);

      // Generate the thumbnail with the specified dimensions
      await sharpInstance.resize(width, height).toFile(thumbFullPath);

      // Clear the Sharp instance to release resources
      sharpInstance = null;

      return join(thumbnailsDir, thumbFilename);
    } catch (error) {
      console.error(`Failed to generate thumbnail for: ${fullPath}`, error);
      return undefined;
    } finally {
      // Ensure Sharp instance is always properly destroyed to release file handles
      // This is crucial for allowing file deletion operations to succeed
      if (sharpInstance) {
        sharpInstance.destroy();
        sharpInstance = null;
      }
    }
  }

  /**
   * Creates a thumbnail for an uploaded file and returns metadata about the thumbnail.
   * Only processes image files and respects the generateThumbnails configuration option.
   *
   * @param currentFolder - The folder where the original file is stored
   * @param file - The uploaded file metadata
   * @param fullPath - Full path to the original file
   * @returns Thumbnail metadata or undefined if no thumbnail was created
   */
  public async createThumbnail(currentFolder: string, file: Express.Multer.File, fullPath: string) {
    let thumbnailData: UploadFileType['thumbnail'] = undefined;
    let sharpMetadataInstance: sharp.Sharp | null = null;

    try {
      // Only process image files when thumbnail generation is enabled
      if (this.thumbnailOptions.generateThumbnails && file.mimetype.startsWith('image/')) {
        // Generate the thumbnail and get its path
        const generatedThumbnailPath = await this.generateThumbnail(currentFolder, fullPath);

        // If thumbnail generation was successful, extract metadata
        if (generatedThumbnailPath) {
          // Get file size information
          const thumbStat = await fs.stat(generatedThumbnailPath);

          // IMPORTANT: Use a buffer for metadata extraction to avoid keeping file handles open
          // This is crucial for preventing file locking issues
          const thumbBuffer = await fs.readFile(generatedThumbnailPath);
          sharpMetadataInstance = sharp(thumbBuffer);
          const metadata = await sharpMetadataInstance.metadata();

          // Construct the thumbnail metadata object
          thumbnailData = {
            path: getPath(generatedThumbnailPath),
            fullPath: generatedThumbnailPath,
            size: thumbStat.size,
            dimensions: { width: metadata.width!, height: metadata.height! },
            mimetype: `image/${metadata.format}`,
          };
        }
      }

      return thumbnailData;
    } catch (error) {
      console.error(`Error creating thumbnail metadata: ${fullPath}`, error);
      return undefined;
    } finally {
      // Always clean up Sharp resources to prevent memory leaks and file handle issues
      if (sharpMetadataInstance) {
        sharpMetadataInstance.destroy();
        sharpMetadataInstance = null;
      }
    }
  }

  /**
   * Updates the thumbnail generation options.
   *
   * @param thumbnailOptions - New thumbnail options to apply
   */
  public setThumbnailOptions(thumbnailOptions: ThumbnailOptions) {
    // Merge existing options with new options, with new options taking precedence
    this.thumbnailOptions = { ...this.thumbnailOptions, ...thumbnailOptions };
  }
}