import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsBooleanDontAcceptNull()
  @convertBoolean()
  isDelete: boolean;
}
