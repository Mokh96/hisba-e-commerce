import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLotDto } from './create-lot.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class UpdateLotDto extends PartialType(
  OmitType(CreateLotDto, ['articleId'] as const),
) {}

export class UpdateSyncLotDto extends IntersectionType(
  UpdateLotDto,
  SyncIdDto,
) {}
