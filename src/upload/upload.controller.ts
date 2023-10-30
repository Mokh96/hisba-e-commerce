import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@Controller('upload')
@Public()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  getUpload() {
    return 'hello world';
  }
  @Post()
  @UseInterceptors(
    UploadService.createUploadOptions([{ name: 'file', maxCount: 1 }]),
  )
  uploadFile(@Body() title: string) {
    if (title) {
      return {
        title: title,
        message: 'File uploaded successfully',
      };
    } else {
      return {
        message: 'No file uploaded',
      };
    }
  }
  //   uploadFile(@UploadedFile() file, @Body() name: string) {
  //     if (file) {
  //       return {
  //         title: name,
  //         originalname: file.originalname,
  //         filename: file.filename,
  //       };
  //     } else {
  //       return {
  //         title: name,
  //         message: 'No file uploaded',
  //       };
  //     }
  //   }

  //   @Post()
  //   @UseInterceptors(FileInterceptor('file'))
  //   public async uploadFile(
  //     @UploadedFile(
  //       new ParseFilePipeBuilder()
  //         .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
  //         .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
  //         .build({
  //           errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //           fileIsRequired: false,
  //         }),
  //     )
  //     file: Express.Multer.File,

  //     @Body() name: string,
  //   ) {
  //     if (file) {
  //       return { file, name };
  //     }
  //     return name;
  //   }
}
