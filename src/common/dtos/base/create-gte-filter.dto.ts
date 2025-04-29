import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Creates a DTO with a `gte` (greater than or equal) filter field.
 */
export function createGteDto<T extends object>(ValidatorClass: new () => T) {
  class GteDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    gte?: T = {} as T;
  }

  return GteDto;
}
