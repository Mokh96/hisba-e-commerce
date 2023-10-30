import { Type } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  ref: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  label2: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBooleanString()
  isOutStock: boolean;

  @IsOptional()
  @IsBooleanString()
  isExpired: boolean;

  @IsOptional()
  @IsBooleanString()
  isMultiArticle: boolean;

  @IsOptional()
  @IsBooleanString()
  isActive: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  brandId: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  categoryId: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  familyId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleDto)
  articles: CreateArticleDto[];
}
