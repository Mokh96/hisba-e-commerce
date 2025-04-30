import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Generates a DTO class with a typed `gt` field for "greater than" filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for fields
 * @returns A DTO class with gt object property
 *
 * @example
 * ```TypeScript
 * // Define validator
 * class PriceValidator {
 *   @IsOptional()
 *   @IsNumber()
 *   price?: number;
 * }
 *
 * // Create gt DTO
 * class PriceGtDto extends createGtDto(PriceValidator) {}
 *
 * // Usage:
 * const dto = new PriceGtDto();
 * dto.gt = { price: 100 }; // Find items where price > 100
 * ```
 *
 * @note The gt object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass
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