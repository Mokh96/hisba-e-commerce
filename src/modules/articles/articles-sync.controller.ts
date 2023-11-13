import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateSyncArticleDto } from './dto/create-article.dto';
import { UpdateSyncArticleDto } from './dto/update-article.dto';
import { validateBulk } from 'src/helpers/validation/validation';

@Controller('articles/sync')
export class ArticlesSyncController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createSyncArticleDto: CreateSyncArticleDto) {
    return this.articlesService.create(createSyncArticleDto);
  }

  @Post('/bulk')
  async createBulk(@Body(ParseArrayPipe) createSyncArticleDtoArray) {
    const { valSuccess, valFailures } = await validateBulk(
      createSyncArticleDtoArray,
      CreateSyncArticleDto,
    );

    const { success, baseFailures } = await this.articlesService.createBulk(
      valSuccess,
    );

    return { success, valFailures, baseFailures };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateSyncArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }
}
