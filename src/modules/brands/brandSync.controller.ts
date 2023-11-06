import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
  Param,
  ParseIntPipe,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateSyncBrandDto } from './dto/createSync-brand.dto';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { IsArrayPipe } from 'src/pipes/isArray.pipe';
@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  createSync(
    @Body() createSyncBrandDto: CreateSyncBrandDto,
    @UploadedFiles() file: Image,
  ) {
    return this.brandsService.create(createSyncBrandDto, file);
  }
  @Post('/bulk')
  @UsePipes(new IsArrayPipe())
  createSyncBulk(@Body() createSyncBrandBulkDto: CreateSyncBrandDto[]) {
    return this.brandsService.createSyncBulk(createSyncBrandBulkDto);
  }

  @Patch()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  updateSync(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFiles() file: Image,
  ) {
    return this.brandsService.update(+id, updateBrandDto, file);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(+id);
  }
}
