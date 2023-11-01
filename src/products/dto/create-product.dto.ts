import { OmitType } from '@nestjs/mapped-types';
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
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

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

  @IsBooleanDontAcceptNull()
  isOutStock: boolean;

  @IsBooleanDontAcceptNull()
  isExpired: boolean;

  @IsBooleanDontAcceptNull()
  isMultiArticle: boolean;

  @convertBoolean()
  @IsBooleanDontAcceptNull()
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
  @Type(() => createLotDtoArray)
  articles: createLotDtoArray[];
}

class createLotDtoArray extends OmitType(CreateArticleDto, [
  'productId',
] as const) {}
