import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import {
  IsBooleanDontAcceptNull,
  convertBoolean,
} from 'src/common-dtos/custom-validator-decorator/custom-validator.decorator';
import { TransformStringToBoolean } from 'src/common/decorators';
import { IsBoolean, IsOptional } from 'class-validator';
export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @TransformStringToBoolean({ allowNull: false })
  @IsBoolean()
  @IsOptional()
  removeImage: boolean;
}
