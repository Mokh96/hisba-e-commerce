import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateFamilyDto } from './create-family.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { UpdateBrandDto } from 'src/modules/brands/dto/update-brand.dto';

export class UpdateFamilyDto extends IntersectionType(PartialType(CreateFamilyDto), RemoveImageDto) {
}



export class UpdateSyncFamiliesDto extends IntersectionType(UpdateFamilyDto, SyncIdDto, IdCommonDto) {}