import { IsOptional, IsString, IsBooleanString, IsNumberString } from 'class-validator';

export class ProductSearchDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  defaultImgPath?: string;

  @IsOptional()
  @IsString()
  ref?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  label2?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBooleanString()
  isOutStock?: string; // 'true' or 'false' as string

  @IsOptional()
  @IsBooleanString()
  isExpired?: string;

  @IsOptional()
  @IsBooleanString()
  isMultiArticle?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
