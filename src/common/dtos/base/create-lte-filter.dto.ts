import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Creates a DTO with a `lte` (less than or equal) filter field.
 */
export function createLteDto<T extends object>(ValidatorClass: new () => T) {
  class LteDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    lte?: T = {} as T;
  }

  return LteDto;
}
