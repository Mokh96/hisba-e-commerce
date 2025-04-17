import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { CreateBrandDto } from 'src/modules/brands/dto/create-brand.dto';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';

export class UpdateCategoryDto extends IntersectionType(PartialType(CreateCategoryDto), RemoveImageDto) {}
