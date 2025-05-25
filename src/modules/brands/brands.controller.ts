import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UseOptionalImageUpload } from 'src/common/decorators/files/use-optional-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { BrandFilterDto } from 'src/modules/brands/dto/brand-filter.dto';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseRequiredImageUpload()
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return this.brandsService.create(createBrandDto, files);
  }

  @Get()
  findMany(@Query() filterDto: BrandFilterDto) {
    return this.brandsService.findMany(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @UseOptionalImageUpload()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return await this.brandsService.update(id, updateBrandDto, files);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(+id);
  }
}
