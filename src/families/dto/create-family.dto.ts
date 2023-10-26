import { IsNumber } from 'class-validator';
import { Label } from 'src/common-dtos/label.common.dto';

export class CreateFamilyDto extends Label {
  @IsNumber()
  parentId: number;
}
