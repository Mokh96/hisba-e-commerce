import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseOptionalImageUpload } from 'src/common/decorators/files/use-optional-image-upload.decorator';
import { CategoryFilterDto } from 'src/modules/categories/dto/category-filter.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseRequiredImageUpload()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return await this.categoriesService.create(createCategoryDto, files);
  }

  @Get()
  findMany(@Query() filterDto: CategoryFilterDto) {
    return this.categoriesService.findMany(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseOptionalImageUpload()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return this.categoriesService.update(id, updateCategoryDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
