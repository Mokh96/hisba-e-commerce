import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateLotDto } from './create-lot.dto';

export class UpdateLotDto extends PartialType(
  PickType(CreateLotDto, ['price', 'isActive', 'isDisponible'] as const),
) {}
