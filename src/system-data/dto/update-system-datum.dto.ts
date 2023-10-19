import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemDatumDto } from './create-system-datum.dto';

export class UpdateSystemDatumDto extends PartialType(CreateSystemDatumDto) {}
