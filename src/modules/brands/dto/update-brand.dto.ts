import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';

export class UpdateBrandDto extends IntersectionType(PartialType(CreateBrandDto), RemoveImageDto) {}

export class UpdateSyncBrandsDto extends IntersectionType(UpdateBrandDto, SyncIdDto, IdCommonDto) {}
