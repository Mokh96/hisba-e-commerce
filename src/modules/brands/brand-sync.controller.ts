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

@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  async createSync(@Body() createSyncBrandDto: CreateSyncBrandDto, @UploadedFiles() file: Image) {
    return await this.brandsService.create(createSyncBrandDto, file as any);
  }

  @Post('/bulk')
  async createSyncBulk(@Body(IsArrayPipe) createSyncBrandBulkDto: CreateSyncBrandDto[], @Res() res: Response) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateSyncBrandDto>(
      createSyncBrandBulkDto,
      CreateSyncBrandDto,
    );
    const { successes, failures } = await this.brandsService.createSyncBulk(valSuccess);

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
