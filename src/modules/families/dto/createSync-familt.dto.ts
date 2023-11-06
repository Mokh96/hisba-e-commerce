import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { CreateFamilyDto } from './create-family.dto';

export class CreateSyncFamilyDto extends CreateFamilyDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
