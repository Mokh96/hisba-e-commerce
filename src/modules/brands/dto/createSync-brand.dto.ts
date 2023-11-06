import { Type } from 'class-transformer';
import { CreateBrandDto } from './create-brand.dto';
import { IsPositive, IsInt } from 'class-validator';

export class CreateSyncBrandDto extends CreateBrandDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
