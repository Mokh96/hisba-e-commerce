import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Creates a DTO with a `lt` (less than) filter field.
 */
export function createLtDto<T extends object>(ValidatorClass: new () => T) {
  class LtDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    lt?: T = {} as T;
  }

  return LtDto;
}
