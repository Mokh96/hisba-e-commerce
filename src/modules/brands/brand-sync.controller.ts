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
import { BrandsService } from './brands.service';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
import { UpdateBrandDto, UpdateSyncBrandsDto } from './dto/update-brand.dto';
import { IsArrayPipe } from 'src/pipes/isArray.pipe';
import { CreateSyncBrandDto } from './dto/create-brand.dto';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { Response } from 'express';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { optionalImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { ParseFormDataArrayInterceptor } from 'src/common/interceptors/parse-form-data-array.interceptor';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/ValidateBulkDtoInterceptor';
import { UpdateSyncArticleDto } from 'src/modules/articles/dto/update-article.dto';
import {
  createArticlesValidation,
  updateArticlesValidation,
} from 'src/modules/articles/config/article-file-validation.config';
import { CreateSyncArticleDto } from 'src/modules/articles/dto/create-article.dto';
import { createBrandsValidation, updateBrandsValidation } from 'src/modules/brands/config/brand-file-validation.config';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { UseBulkUpload } from 'src/common/decorators/files/use-bulk-upload.decorator';

@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseRequiredImageUpload()
  async createSync(
    @Body() createSyncBrandDto: CreateSyncBrandDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return await this.brandsService.create(createSyncBrandDto, files);
  }

  @Post('/bulk')
  @UseBulkUpload(CreateSyncBrandDto, createBrandsValidation)
  async createSyncBulk(
    @Body() createSyncBrandBulkDto: CreateSyncBrandDto[],
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.brandsService.createSyncBulk(createSyncBrandBulkDto, files);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });

    res.status(status).json(response);
  }

  @Patch('/bulk')
  @UseBulkUpload(UpdateSyncBrandsDto, updateBrandsValidation)
  async updateBulk(
    @Res() res: Response,
    @Body() updateBrandDto: UpdateSyncBrandsDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.brandsService.updateBulk(updateBrandDto, files);

    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });
    return res.status(status).json(response);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(+id);
  }
}
