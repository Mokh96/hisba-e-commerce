import { IsString, Length } from 'class-validator';

export class Label {
  @IsString()
  @Length(2, 255)
  label: string;
}
