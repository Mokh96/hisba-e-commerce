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
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { UpdateSyncBrandsDto } from './dto/update-brand.dto';
import { CreateSyncBrandDto } from './dto/create-brand.dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { Response } from 'express';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
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
    @Res() res: Response,
    @Body() createSyncBrandBulkDto: CreateSyncBrandDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.brandsService.createSyncBulk(createSyncBrandBulkDto, files);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });

    //res.status(status).json(response);
    res.status(207).json(response);
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
