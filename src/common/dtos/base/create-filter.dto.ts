import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Creates a DTO with a `gt` (greater than) filter field.
 */
export function createGtDto<T extends object>(ValidatorClass: new () => T) {
  class GtDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    gt?: T = {} as T;
  }

  return GtDto;
}
