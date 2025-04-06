import { IsBoolean, IsOptional } from 'class-validator';
import { LabelCommonDto } from 'src/common-dtos/label.common.dto';

export class CreatePaymentMethodDto extends LabelCommonDto {
  @IsOptional()
  @IsBoolean()
  isStamp: boolean;
}
