import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['articles'] as const),
) {}

export class UpdateSyncProductDto extends IntersectionType(
  UpdateProductDto,
  SyncIdDto,
) {}
