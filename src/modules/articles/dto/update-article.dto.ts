import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateArticleDto extends PartialType(OmitType(CreateArticleDto, ['productId'] as const)) {}

export class UpdateSyncArticleDto extends IntersectionType(IdCommonDto, UpdateArticleDto) {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  syncId: number | undefined;
}
