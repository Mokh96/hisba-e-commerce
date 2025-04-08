import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateSyncArticleDto } from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { imageUploadRules } from 'src/modules/files/config/file-upload.config';
import { UpdateProductDto } from 'src/modules/products/dto/update-product.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /* @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: imageUploadRules }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto, @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] }
  ) {
    console.log(createArticleDto);
    console.log(files);
    return {
      ...createArticleDto,
    };
    //return this.articlesService.create(createArticleDto);
  }*/

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: { ...imageUploadRules, required: true, minCount: 1 } }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return this.articlesService.create(createArticleDto, files);
  }

  @Get()
  findAll(@Query() queryArticleDto: QueryArticleDto) {
    return this.articlesService.findAll(queryArticleDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto as UpdateSyncArticleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(+id);
  }
}
