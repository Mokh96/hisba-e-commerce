import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export function createDateRangeFiltersDto<T extends object>(ValidatorClass: new () => T) {
  class DateRangeFiltersDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ValidatorClass)
    date?: T;
  }

  return DateRangeFiltersDto;
}
