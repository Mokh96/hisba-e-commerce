import { IsString, Min } from 'class-validator';

export class CreateOptionsValueDto {
  @IsString()
  @Min(1)
  value: string;
}
