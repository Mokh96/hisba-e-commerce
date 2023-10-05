import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleGalleriesService } from './article-galleries.service';
import { CreateArticleGalleryDto } from './dto/create-article-gallery.dto';
import { UpdateArticleGalleryDto } from './dto/update-article-gallery.dto';

@Controller('article-galleries')
export class ArticleGalleriesController {
  constructor(private readonly articleGalleriesService: ArticleGalleriesService) {}

  @Post()
  create(@Body() createArticleGalleryDto: CreateArticleGalleryDto) {
    return this.articleGalleriesService.create(createArticleGalleryDto);
  }

  @Get()
  findAll() {
    return this.articleGalleriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleGalleriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleGalleryDto: UpdateArticleGalleryDto) {
    return this.articleGalleriesService.update(+id, updateArticleGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleGalleriesService.remove(+id);
  }
}
