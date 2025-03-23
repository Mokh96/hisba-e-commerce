export type ThumbnailOptions = {
  /**
   * Whether to generate thumbnails for the uploaded files.
   * @default true
   */
  generateThumbnails?: boolean;

  /**
   * The size of the thumbnails to generate.
   * @default { width: 200, height: 200 }
   *
   */
  thumbnailSize?: { width: number; height: number };
};
