import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateSyncArticleDto } from './dto/update-article.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ParseFormDataArrayInterceptor } from 'src/common/interceptors/parse-form-data-array.interceptor';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/ValidateBulkDtoInterceptor';
import {
  createArticlesValidation,
  updateArticlesValidation,
} from 'src/modules/articles/config/article-file-validation.config';
import { Response } from 'express';
import { ParseFormDataArrayPipe } from 'src/common/pipes/parse-form-data-array.pipe';
import { UpdateSyncProductDto } from 'src/modules/products/dto/update-product.dto';

@Controller('articles/sync')
export class ArticlesSyncController {
  constructor(private readonly articlesService: ArticlesService) {}

  /* @Post()
   create(@Body() createSyncArticleDto: CreateSyncArticleDto) {
     return this.articlesService.create(createSyncArticleDto);
   }*/

  @Post('/bulk')
  @UseInterceptors(
    AnyFilesInterceptor(),
    ParseFormDataArrayInterceptor,
    new ValidateBulkDtoInterceptor(CreateSyncArticleDto),
    createArticlesValidation,
  )
  async createBulk(
    @Res() res: Response,
    @Body() createSyncArticlesDto: CreateSyncArticleDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.articlesService.createBulk(createSyncArticlesDto, files);
    res.status(207).json(response);
  }

  @Patch('bulk')
  @UseInterceptors(
    AnyFilesInterceptor(),
    ParseFormDataArrayInterceptor,
    new ValidateBulkDtoInterceptor(UpdateSyncArticleDto),
    updateArticlesValidation,
  )
  async updateBulk(
    @Res() res: Response,
    @Body() updateSyncArticleDto: UpdateSyncArticleDto[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const response = await this.articlesService.updateBulk(updateSyncArticleDto, files);
    return res.status(207).json(response);
  }

  /*@Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateSyncArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }*/
}
