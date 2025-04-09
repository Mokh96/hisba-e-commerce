import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { LabelCommonDto } from 'src/common-dtos/label.common.dto';

export class CreatePaymentMethodDto extends LabelCommonDto {
  @IsOptional()
  @IsBoolean()
  isStamp: boolean;
}

export class CreateSyncPaymentMethodDto extends CreatePaymentMethodDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
