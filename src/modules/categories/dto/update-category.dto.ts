import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { RemoveImageDto } from 'src/common/dtos/remove-image.dto';
import { SyncIdDto } from 'src/common/dtos/sync-id.dto';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';


export class UpdateCategoryDto extends IntersectionType(PartialType(CreateCategoryDto), RemoveImageDto) {}

export class UpdateSyncCategoryDto extends IntersectionType(UpdateCategoryDto, SyncIdDto, IdCommonDto) {}
