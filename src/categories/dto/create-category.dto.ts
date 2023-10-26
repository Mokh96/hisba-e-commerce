import { IsNumber, IsNumberString, IsString } from 'class-validator';
import { Label } from 'src/common-dtos/label.common.dto';

export class CreateCategoryDto extends Label {
  @IsNumber()
  parentId: number;
}
