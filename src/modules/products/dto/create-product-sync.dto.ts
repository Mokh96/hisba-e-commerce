import { IsInt, IsPositive } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class createProductSync extends CreateProductDto {
  @IsPositive()
  @IsInt()
  syncId: number;
}
