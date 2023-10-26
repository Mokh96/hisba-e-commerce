import { IsNumber, IsNumberString } from 'class-validator';
import { Label } from 'src/common-dtos/label.common.dto';

export class CreateBrandDto extends Label {
  @IsNumberString()
  parentId: number;
}
