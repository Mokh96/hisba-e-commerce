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
import { UpdateBrandDto } from './dto/update-brand.dto';
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
import { createBrandsValidation } from 'src/modules/brands/config/brand-file-validation.config';

@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({
      [FileUploadEnum.Image]: { ...optionalImageUploadRules },
    }),
  )
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
  @UseInterceptors(
    AnyFilesInterceptor(),
    ParseFormDataArrayInterceptor,
    new ValidateBulkDtoInterceptor(CreateSyncBrandDto),
    createBrandsValidation,
  )
  async createSyncBulk(
    @Body(IsArrayPipe) createSyncBrandBulkDto: CreateSyncBrandDto[],
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateSyncBrandDto>(
      createSyncBrandBulkDto,
      CreateSyncBrandDto,
    );
    const { successes, failures } = await this.brandsService.createSyncBulk(valSuccess, files);

    const result = {
      successes,
      failures: [...valFailures, ...failures],
    };

    const status = getBulkStatus({ failures: result.failures.length, success: result.successes.length });

    res.status(status).json(result);
  }

  @Patch()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
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
