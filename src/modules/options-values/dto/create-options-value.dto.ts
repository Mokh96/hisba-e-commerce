import { IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOptionsValueDto {
  @IsString()
  value: string;

  @IsPositive()
  @IsInt()
  optionId: number;
}

export class CreateOptionValueSyncDto extends CreateOptionsValueDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
