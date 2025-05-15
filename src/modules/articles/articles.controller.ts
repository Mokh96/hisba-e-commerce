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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { FileValidationInterceptor } from 'src/modules/files/interceptors/file-validation-interceptor';
import { imageUploadRules, requiredImageUploadRules } from 'src/modules/files/config/file-upload.config';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { ArticleFilterDto } from 'src/modules/articles/config/article-filter.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: { ...requiredImageUploadRules } }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return this.articlesService.create(createArticleDto, files);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query() articleFilterDto: ArticleFilterDto) {
    return this.articlesService.findAll(paginationDto, articleFilterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: FileUploadEnum.Image }]),
    new FileValidationInterceptor({ [FileUploadEnum.Image]: imageUploadRules }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFiles() files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    return this.articlesService.update(id, updateArticleDto, files);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
