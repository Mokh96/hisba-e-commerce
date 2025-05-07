import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Generates a DTO class with a typed `lte` field for less-than-or-equal filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for lte fields
 * @returns A DTO class with lte object property
 *
 * @example
 * ```TypeScript
 * // Define lte validator
 * class PriceLteValidator {
 *   @IsOptional()
 *   @IsNumber()
 *   @Min(0)
 *   price?: number;
 * }
 *
 * // Create lte DTO
 * class ProductLteDto extends createLteDto(PriceLteValidator) {}
 *
 * // Usage:
 * const dto = new ProductLteDto();
 * dto.lte = { price: 100 }; // Will match records where price <= 100
 * ```
 *
 * @note The lte object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass
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
