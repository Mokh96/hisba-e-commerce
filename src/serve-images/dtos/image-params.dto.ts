import { IsNumberString, IsString, IsIn } from 'class-validator';

export class ImageParamsDto {
  @IsIn(['images'])
  type: string;

  @IsNumberString()
  file: string;

  @IsString()
  name: string;
}
