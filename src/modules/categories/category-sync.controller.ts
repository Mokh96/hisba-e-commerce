import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post, Put,
  Res,
  UploadedFiles,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { UpdateCategoryDto, UpdateSyncCategoryDto } from './dto/update-category.dto';
import { CreateSyncCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseBulkUpload } from 'src/common/decorators/files/use-bulk-upload.decorator';
import {
  createCategoriesValidation,
  updateCategoriesValidation,
} from 'src/modules/categories/config/category-file-validation.config';

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

  @Put('/bulk')
  @UseBulkUpload(UpdateSyncCategoryDto, updateCategoriesValidation)
  updateSync(
    @Body() updateBrandDto: UpdateSyncCategoryDto [],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.categoryService.updateBulk(updateBrandDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
