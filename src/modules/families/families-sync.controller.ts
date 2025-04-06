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
import { UpdateFamilyDto } from './dto/update-family.dto';
import { CreateSyncFamilyDto } from './dto/create-family.dto';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';

@Controller('families/sync')
export class SyncFamilyController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  createSync(@Body() createSyncCategotyDto: CreateSyncFamilyDto, @UploadedFiles() file: Image) {
    return this.familiesService.create(createSyncCategotyDto, file);
  }

  @Post('/bulk')
  async createSyncBulk(@Res() res: Response, @Body(IsArrayPipe) createFamilyDto: CreateSyncFamilyDto[]) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateSyncFamilyDto>(
      createFamilyDto,
      CreateSyncFamilyDto,
    );
    const { successes, failures } = await this.familiesService.createBulk(valSuccess);

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
    @Body() updateBrandDto: UpdateFamilyDto,
    @UploadedFiles() file: Image,
  ) {
    return this.familiesService.update(+id, updateBrandDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.remove(+id);
  }
}
