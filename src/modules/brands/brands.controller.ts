import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { Upload } from 'src/helpers/upload/upload.global';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Image } from 'src/types/types.global';
import { BrandsService } from './brands.service';
import { BrandFilterDto } from './dto/brand-filter.dto';
import { CreateBrandDto, CreateSyncBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  create(@Body() createBrandDto: CreateBrandDto, @UploadedFiles() file: Image) {
    return this.brandsService.create(createBrandDto as CreateSyncBrandDto, file);
  }

  @Get()
  findMany(@Query() filterDto: BrandFilterDto, @Query() paginationDto: BasePaginationDto) {
    return this.brandsService.findMany(filterDto, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto, @UploadedFiles() file: Image) {
    return this.brandsService.update(+id, updateBrandDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(+id);
  }
}
