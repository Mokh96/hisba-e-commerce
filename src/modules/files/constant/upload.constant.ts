/**
 * Root directory for all uploaded files.
 */
export const UPLOAD_ROOT_DIR = 'uploads';

/**
 * Limit of files per folder. When the limit is exceeded, a new folder will be created.
 */
export const MAX_FILES_PER_FOLDER = 100;
/**
 * Folder name for thumbnails.
 */
export const THUMBNAIL_FOLDER_NAME = 'thumbnails';

/**
 * Maximum allowed size for image files in bytes.
 */
export const IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Maximum allowed size for PDF files in bytes.
 */
export const PDF_MAX_SIZE = 5 * 10 * 1024 * 1024; // 50MB