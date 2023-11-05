import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { CreatSyncBrandDto } from './createSync-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsBooleanDontAcceptNull()
  @convertBoolean()
  isDelete: boolean;
}
