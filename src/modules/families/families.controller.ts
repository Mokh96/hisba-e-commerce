import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { Upload } from 'src/helpers/upload/upload.global';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Image } from 'src/types/types.global';
import { CreateFamilyDto, CreateSyncFamilyDto } from './dto/create-family.dto';
import { FamilyFilterDto } from './dto/family-filter.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamiliesService } from './families.service';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  create(@Body() createFamilyDto: CreateFamilyDto, @UploadedFiles() file: Image) {
    return this.familiesService.create(createFamilyDto as CreateSyncFamilyDto, file);
  }

  @Get()
  findMany(@Query() filterDto: FamilyFilterDto, @Query() paginationDto: BasePaginationDto) {
    return this.familiesService.findMany(filterDto, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(new UploadInterceptor({ type: '1' }), Upload([{ name: 'img', maxCount: 1 }]))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
    @UploadedFiles() file: Image,
  ) {
    return this.familiesService.update(+id, updateFamilyDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.remove(+id);
  }
}
