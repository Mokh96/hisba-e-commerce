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

@Controller('categories/sync')
export class SyncCategoryController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  createSync(@Body() createSyncCategoryDto: CreateSyncCategoryDto, @UploadedFiles() file: Image) {
    return this.categoryService.create(createSyncCategoryDto, file);
  }

  @Post('/bulk')
  async createSyncBulk(@Body(new IsArrayPipe()) createSyncCategoryDto: CreateSyncCategoryDto[], @Res() res: Response) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateSyncCategoryDto>(
      createSyncCategoryDto,
      CreateSyncCategoryDto,
    );
    const { successes, failures } = await this.categoryService.createBulk(valSuccess);

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
    @Body() updateBrandDto: UpdateCategoryDto,
    @UploadedFiles() file: Image,
  ) {
    return this.categoryService.update(+id, updateBrandDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
