import { Type } from 'class-transformer';
import { CreateBrandDto } from './create-brand.dto';
import { IsOptional, IsPositive, IsInt } from 'class-validator';

export class CreatSyncBrandDto extends CreateBrandDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
