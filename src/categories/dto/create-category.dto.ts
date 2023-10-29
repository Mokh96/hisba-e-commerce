import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Label } from 'src/common-dtos/label.common.dto';

export class CreateCategoryDto extends Label {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId: number;
}
