import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';

export class CategoryFilterDto extends BaseFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  parentId?: number | number[];
}
