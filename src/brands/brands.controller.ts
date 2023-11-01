import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
interface Test {
  file: Express.Multer.File;
}
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  create(@Body() createBrandDto: CreateBrandDto, @UploadedFiles() file: Image) {
    return this.brandsService.create(createBrandDto, file);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  update(
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
