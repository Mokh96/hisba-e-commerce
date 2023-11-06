import { Type } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { IsInt, IsPositive } from 'class-validator';

export class CreateSyncCategoryDto extends CreateCategoryDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
