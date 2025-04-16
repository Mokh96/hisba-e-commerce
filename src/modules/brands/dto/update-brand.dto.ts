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

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @TransformStringToBoolean({ allowNull: false })
  @IsBoolean()
  @IsOptional()
  removeImage: boolean;
}

export class UpdateSyncBrandsDto extends IntersectionType(UpdateBrandDto, SyncIdDto , IdCommonDto) {}
