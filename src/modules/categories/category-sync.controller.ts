import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
import { IsArrayPipe } from 'src/pipes/isArray.pipe';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSyncCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseBulkUpload } from 'src/common/decorators/files/use-bulk-upload.decorator';
import { CreateSyncBrandDto } from 'src/modules/brands/dto/create-brand.dto';
import { createBrandsValidation } from 'src/modules/brands/config/brand-file-validation.config';
import { createCategoriesValidation } from 'src/modules/categories/config/category-file-validation.config';

@Controller('categories/sync')
export class SyncCategoryController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UseRequiredImageUpload()
  createSync(
    @Body() createSyncCategoryDto: CreateSyncCategoryDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return this.categoryService.create(createSyncCategoryDto, files);
  }

  @Post('/bulk')
  @UseBulkUpload(CreateSyncCategoryDto, createCategoriesValidation)
  async createSyncBulk(
    @Res() res: Response,
    @Body() createSyncCategoryDto: CreateSyncCategoryDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.categoryService.createSyncBulk(createSyncCategoryDto, files);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });

    res.status(status).json(response);
  }

  @Patch()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  updateSync(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateCategoryDto,
    @UploadedFiles() file: Image,
  ) {
    return this.categoryService.update(+id, updateBrandDto, file as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
