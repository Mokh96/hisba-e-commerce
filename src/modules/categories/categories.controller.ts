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
import { CategoriesService } from './categories.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFiles() file: Image) {
    return this.categoriesService.create(createCategoryDto as CreateCategoryDto, file);
  }

  @Get()
  findMany(@Query() filterDto: CategoryFilterDto, @Query() paginationDto: BasePaginationDto) {
    return this.categoriesService.findMany(filterDto, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles() file: Image,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(+id);
  }
}
