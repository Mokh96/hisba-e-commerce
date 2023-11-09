import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, CreateSyncFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { Upload } from 'src/helpers/upload/upload.global';
import { Image } from 'src/types/types.global';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
  create(
    @Body() createFamilyDto: CreateFamilyDto,
    @UploadedFiles() file: Image,
  ) {
    return this.familiesService.create(
      createFamilyDto as CreateSyncFamilyDto,
      file,
    );
  }

  @Get()
  findAll() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    new UploadInterceptor({ type: '1' }),
    Upload([{ name: 'img', maxCount: 1 }]),
  )
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
