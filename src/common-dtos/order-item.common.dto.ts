import {
  IsBoolean,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class OrderItemCommonDto {
  @IsString()
  @Max(255)
  code: string;

  @IsString()
  @Max(255)
  ref: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @Length(2, 255)
  label: string;

  @IsNumber()
  discount: number;

  @IsNumber()
  discountPercentage: number;

  @IsNumber()
  tvaPercentage: number;

  @IsNumber()
  @Min(1)
  unitePriceHt: number;

  @IsBoolean()
  isOutStock: boolean;

  @IsNumber()
  @Min(0)
  offset: number;
}
