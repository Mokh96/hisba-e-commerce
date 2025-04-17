import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateFamilyDto } from './create-family.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';

export class UpdateFamilyDto extends IntersectionType(PartialType(CreateFamilyDto), RemoveImageDto) {
}
