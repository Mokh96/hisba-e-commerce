import { PartialType } from '@nestjs/mapped-types';
import { CreateProspectiveTierDto } from './create-prospective-tier.dto';

export class UpdateProspectiveTierDto extends PartialType(
  CreateProspectiveTierDto,
) {}
