import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generates a DTO class with a typed `filters` field for general field filtering.
 */
export function createFiltersDto<F extends object>(ValidatorClass: new () => F) {
  class FiltersDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    filters?: F = {} as F;
  }

  return FiltersDto;
}
