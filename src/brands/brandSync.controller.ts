import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreatSyncBrandDto } from './dto/createSync-brand.dto';
@Controller('brands/sync')
export class SyncBrandController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  createSync(@Body() createSyncBrandDto: CreatSyncBrandDto) {
    return this.brandsService.createSync(createSyncBrandDto);
  }
  @Post('/bulk')
  createSyncBulk() {
    return 'hello world';
  }
  @Patch()
  updateSync() {
    return 'hello world';
  }
}
