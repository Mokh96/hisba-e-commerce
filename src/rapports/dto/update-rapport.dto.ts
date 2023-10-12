import { PartialType } from '@nestjs/mapped-types';
import { CreateRapportDto } from './create-rapport.dto';

export class UpdateRapportDto extends PartialType(CreateRapportDto) {}
