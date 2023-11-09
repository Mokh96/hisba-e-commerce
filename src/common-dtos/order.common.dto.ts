import { IsNumber, Min } from 'class-validator';

export class OrderCommonDto {
  @IsNumber()
  @Min(1)
  amountHt: number;

  @IsNumber()
  @Min(0)
  netAmountTtc: number;

  @IsNumber()
  @Min(0)
  netToPay: number;

  @IsNumber()
  totalTva: number;
}
