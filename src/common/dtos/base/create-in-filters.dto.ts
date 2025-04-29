import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generates a DTO class with an `in` field for filtering by inclusion (e.g., `IN` SQL clause).
 */
export function createInFiltersDto<I extends object>(ValidatorClass: new () => I) {
  class InFiltersDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    in?: I = {} as I;
  }

  return InFiltersDto;
}
