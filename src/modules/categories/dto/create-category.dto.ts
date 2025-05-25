import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { LabelCommonDto } from 'src/common/dtos/label.common.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';

export class CreateCategoryDto extends LabelCommonDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId: number;
}

export class CreateSyncCategoryDto extends IntersectionType(CreateCategoryDto, SyncIdDto) {}
