import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { multerFileFilter, multerLimits, multerStorage } from './upload.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const Upload = (uploadFields: MulterField[]) => {
  return FileFieldsInterceptor(uploadFields, {
    storage: multerStorage,
    fileFilter: multerFileFilter,
    limits: multerLimits,
  });
};
