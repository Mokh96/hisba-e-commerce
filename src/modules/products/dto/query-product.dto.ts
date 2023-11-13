import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateArticleDto,
  CreateSyncArticleDto,
} from 'src/modules/articles/dto/create-article.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
  convertNullNumber,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class CreateProductDto {
  @IsOptional()
  @IsString({ each: true })
  code: string | string[];

  @IsOptional()
  @IsString({ each: true })
  ref: string | string[];

  @IsOptional()
  @IsString({ each: true })
  label: string | string[];

  @IsOptional()
  @IsString({ each: true })
  label2: string | string[];

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  description: string;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isOutStock: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isExpired: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isMultiArticle: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
  isActive: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  brandId: number | number[];

  @Type(() => Number)
  //@convertNullNumber()
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  categoryId: number | number[];

  @Type(() => Number)
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  familyId: number | number[];
}
