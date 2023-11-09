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

import { FamiliesService } from './families.service';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { CreateSyncFamilyDto } from './dto/create-family.dto';

@Controller('families/sync')
export class SyncFamilyController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  createSync(
    @Body() createSyncCategotyDto: CreateSyncFamilyDto,
    @UploadedFiles() file: Image,
  ) {
    return this.familiesService.create(createSyncCategotyDto, file);
  }
  @Post('/bulk')
  @UsePipes(new IsArrayPipe())
  createSyncBulk(@Body() createSyncCategoryBulkDto: CreateSyncFamilyDto[]) {
    return this.familiesService.createSyncBulk(createSyncCategoryBulkDto);
  }

  @Patch()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
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
