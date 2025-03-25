export type UploadFileType = Pick<
  Express.Multer.File,
  'originalname' | 'mimetype' | 'encoding' | 'size' | 'fieldname'
> & {
  path: string;
  filename: string;
  fullPath: string;
  thumbnail:
    | {
        path: string;
        fullPath: string;
        size: number;
        dimensions: { width: number; height: number };
        mimetype: string;
      }
    | undefined;
};
