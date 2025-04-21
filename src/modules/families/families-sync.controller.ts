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
import { Response } from 'express';
import { FamiliesService } from './families.service';
import { UpdateFamilyDto, UpdateSyncFamiliesDto } from './dto/update-family.dto';
import { CreateSyncFamilyDto } from './dto/create-family.dto';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseBulkUpload } from 'src/common/decorators/files/use-bulk-upload.decorator';
import { CreateSyncBrandDto } from 'src/modules/brands/dto/create-brand.dto';
import { createBrandsValidation, updateBrandsValidation } from 'src/modules/brands/config/brand-file-validation.config';
import {
  createFamiliesValidation,
  updateFamiliesValidation,
} from 'src/modules/families/config/family-file-validation.config';
import { UpdateSyncBrandsDto } from 'src/modules/brands/dto/update-brand.dto';

@Controller('families/sync')
export class SyncFamilyController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @UseRequiredImageUpload()
  createSync(
    @Body() createSyncFamilyDto: CreateSyncFamilyDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return this.familiesService.create(createSyncFamilyDto, files);
  }

  @Post('/bulk')
  @UseBulkUpload(CreateSyncBrandDto, createFamiliesValidation)
  async createSyncBulk(
    @Res() res: Response,
    @Body() createFamilyDto: CreateSyncFamilyDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.familiesService.createSyncBulk(createFamilyDto, files);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });

    res.status(status).json(response);
  }

  @Patch('/bulk')
  @UseBulkUpload(UpdateSyncBrandsDto, updateFamiliesValidation)
  updateSync(
    @Body() updateSyncFamiliesDto: UpdateSyncFamiliesDto [],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.familiesService.updateBulk(updateSyncFamiliesDto, files );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.remove(+id);
  }
}
