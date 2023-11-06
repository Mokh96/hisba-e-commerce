import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsBooleanDontAcceptNull()
  @convertBoolean()
  isDelete: boolean;
}
