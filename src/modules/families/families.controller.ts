import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  Query
} from '@nestjs/common';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { CreateFamilyDto, CreateSyncFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { UseRequiredImageUpload } from 'src/common/decorators/files/use-required-image-upload.decorator';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UseOptionalImageUpload } from 'src/common/decorators/files/use-optional-image-upload.decorator';
import { FamiliesService } from 'src/modules/families/families.service';
import { FamilyFilterDto } from 'src/modules/families/dto/family-filter.dto';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  findMany(@Query() filterDto: FamilyFilterDto, @Query() paginationDto: BasePaginationDto) {
    return this.familiesService.findMany(filterDto, paginationDto);
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
