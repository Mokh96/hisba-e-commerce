import { Injectable } from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerFileFilter, multerLimits, multerStorage } from './multer.config';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
interface uploadOptionsParams {
  params: {
    name: string;
    /** Optional maximum number of files per field to accept. */
    maxCount?: number;
  }[];
}
@Injectable()
export class UploadService {
  // static test =  FileFieldsInterceptor(['images'])
  //   static uploadOptions = FileInterceptor('file', {
  //     storage: multerStorage,
  //     fileFilter: multerFileFilter,
  //     limits: multerLimits,
  //   });
  static createUploadOptions(uploadFields: MulterField[]) {
    return FileFieldsInterceptor(uploadFields, {
      storage: multerStorage,
      fileFilter: multerFileFilter,
      limits: multerLimits,
    });
  }

  //   static uploadOptions = FileFieldsInterceptor(
  //     [
  //       {
  //         name: 'file',
  //       },
  //     ],
  //     {
  //       storage: multerStorage,
  //       fileFilter: multerFileFilter,
  //       limits: multerLimits,
  //     },
  //   );
}
