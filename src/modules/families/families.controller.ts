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
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseOptionalImageUpload } from 'src/common/decorators/files/use-optional-image-upload.decorator';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  findAll() {
    return this.familiesService.findAll();
  }

  @Post()
  @UseRequiredImageUpload()
  async create(
    @Body() createFamilyDto: CreateFamilyDto,
    @UploadedFiles()
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    return await this.familiesService.create(createFamilyDto, files);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.findOne(+id);
  }

  @Patch(':id')
  @UseOptionalImageUpload()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return await this.familiesService.update(id, updateFamilyDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.remove(+id);
  }
}
