import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreatSyncBrandDto } from './dto/createSync-brand.dto';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  createSync(
    @Body() createSyncBrandDto: CreatSyncBrandDto,
    @UploadedFiles() file: Image,
  ) {
    return this.brandsService.create(createSyncBrandDto, file);
  }
  @Post('/bulk')
  createSyncBulk() {
    return 'hello world';
  }
  @Patch()
  updateSync() {
    return 'hello world';
  }
}
