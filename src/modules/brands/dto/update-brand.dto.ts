import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { TransformStringToBoolean } from 'src/common/decorators';
import { IsBoolean, IsOptional } from 'class-validator';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';

export class UpdateBrandDto extends IntersectionType(PartialType(CreateBrandDto), RemoveImageDto) {}

export class UpdateSyncBrandsDto extends IntersectionType(UpdateBrandDto, SyncIdDto, IdCommonDto) {}
