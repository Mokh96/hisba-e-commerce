import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  isString,
} from 'class-validator';
import { Label } from 'src/common-dtos/label.common.dto';

export class CreateBrandDto extends Label {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId: number;
}

export class CreateSyncBrandDto extends CreateBrandDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
