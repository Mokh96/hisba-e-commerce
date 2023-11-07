import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles/sync')
export class ArticlesSyncController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createSyncArticleDto: CreateSyncArticleDto) {
    return this.articlesService.create(createSyncArticleDto);
  }

  @Post('/bulk')
  createBulk(@Body() createSyncArticleDto: CreateSyncArticleDto[]) {
    return this.articlesService.createBulk(createSyncArticleDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }
}
