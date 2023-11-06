import { PartialType } from '@nestjs/mapped-types';
import { CreateTierTypeDto } from './create-tier-type.dto';

export class UpdateTierTypeDto extends PartialType(CreateTierTypeDto) {}
