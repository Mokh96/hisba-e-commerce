import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';

export class UpdateArticleDto extends PartialType(
  OmitType(CreateArticleDto, ['productId'] as const),
) {}

export class UpdateSyncArticleDto extends IntersectionType(
  UpdateArticleDto,
  SyncIdDto,
) {}
