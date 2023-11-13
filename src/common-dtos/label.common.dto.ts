import { IsString, Length } from 'class-validator';

export class LabelCommonDto {
  @IsString()
  @Length(2, 255)
  label: string;
}
