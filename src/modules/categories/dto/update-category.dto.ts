import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { CreateBrandDto } from 'src/modules/brands/dto/create-brand.dto';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { UpdateBrandDto } from 'src/modules/brands/dto/update-brand.dto';

export class UpdateCategoryDto extends IntersectionType(PartialType(CreateCategoryDto), RemoveImageDto) {}



export class UpdateSyncCategoryDto extends IntersectionType(UpdateCategoryDto, SyncIdDto, IdCommonDto) {}