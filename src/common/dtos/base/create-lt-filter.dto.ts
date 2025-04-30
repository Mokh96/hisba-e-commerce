import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Generates a DTO class with a typed `lt` field for less-than filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for lt fields
 * @returns A DTO class with lt object property
 *
 * @example
 * ```TypeScript
 * // Define lt validator
 * class ProductLtValidator {
 *   @IsOptional()
 *   @IsNumber()
 *   price?: number;
 *
 *   @IsOptional()
 *   @IsNumber() 
 *   stock?: number;
 * }
 *
 * // Create lt DTO
 * class ProductLtDto extends createLtDto(ProductLtValidator) {}
 *
 * // Usage: 
 * const dto = new ProductLtDto();
 * dto.lt = {
 *   price: 100, // Will match records where price < 100
 *   stock: 50 // Will match records where stock < 50
 * };
 * ```
 *
 * @note The lt object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass
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