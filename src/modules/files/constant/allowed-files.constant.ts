export const allowedImageTypes = [
  'image/png',
  'image/jpg',
  'image/gif',
  'image/jpeg',
  'image/tif',
  'image/tiff',
  'image/svg',
  'image/BMP',
  'image/webp',
] as const;

export const allowedThumbnailTypes = [...allowedImageTypes] as const;

export const allowedPdfTypes = ['application/pdf'] as const;

export type AllowedImageType = (typeof allowedImageTypes)[number];
export type AllowedThumbnailType = (typeof allowedImageTypes)[number];
export type AllowedPdfType = (typeof allowedPdfTypes)[number];
