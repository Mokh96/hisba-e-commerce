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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import {
  CreateArticleDto,
  CreateSyncArticleDto,
} from './dto/create-article.dto';
import {
  UpdateArticleDto,
  UpdateSyncArticleDto,
} from './dto/update-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(
      createArticleDto as CreateSyncArticleDto,
    );
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(
      +id,
      updateArticleDto as UpdateSyncArticleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(+id);
  }
}
