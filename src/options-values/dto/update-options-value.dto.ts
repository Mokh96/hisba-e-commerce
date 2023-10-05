import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionsValueDto } from './create-options-value.dto';

export class UpdateOptionsValueDto extends PartialType(CreateOptionsValueDto) {}
