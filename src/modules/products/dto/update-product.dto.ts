import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { SyncIdDto } from 'src/common-dtos/sync-id.common.dto';
import { TransformStringToBoolean } from 'src/common/decorators';
import { IsBoolean, IsOptional } from 'class-validator';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['articles'])) {
  @TransformStringToBoolean()
  @IsBoolean()
  @IsOptional()
  removeImage: boolean | undefined; //pass true if you want to remove the image
}

export class UpdateSyncProductDto extends IntersectionType(UpdateProductDto , IdCommonDto) {}
