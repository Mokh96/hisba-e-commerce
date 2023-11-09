import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
  Param,
  ParseIntPipe,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';
import { IsArrayPipe } from 'src/pipes/isArray.pipe';
import { CategoriesService } from './categories.service';

import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSyncCategoryDto } from './dto/create-category.dto';

@Controller('categories/sync')
export class SyncCategoryController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  createSync(
    @Body() createSyncCategotyDto: CreateSyncCategoryDto,
    @UploadedFiles() file: Image,
  ) {
    return this.categoryService.create(createSyncCategotyDto, file);
  }
  @Post('/bulk')
  @UsePipes(new IsArrayPipe())
  createSyncBulk(@Body() createSyncCategoryBulkDto: CreateSyncCategoryDto[]) {
    return this.categoryService.createSyncBulk(createSyncCategoryBulkDto);
  }

  @Patch()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
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
