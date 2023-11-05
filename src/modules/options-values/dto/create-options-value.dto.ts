import { IsString, Min, IsInt, IsPositive } from 'class-validator';

export class CreateOptionsValueDto {
  @IsString()
  value: string;

  @IsPositive()
  @IsInt()
  optionId: number;
}
