import { PartialType } from '@nestjs/mapped-types';
import { CreateFamilyDto } from './create-family.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {
  @IsBooleanDontAcceptNull()
  @convertBoolean()
  isDelete: boolean;
}
