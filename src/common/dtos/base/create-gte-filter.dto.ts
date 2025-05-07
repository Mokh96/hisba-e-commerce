import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generates a DTO class with a typed `gte` field for greater than or equal filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for gte fields
 * @returns A DTO class with gte object property
 *
 * @example
 * ```TypeScript
 * // Define GTE validator
 * class ProductGteValidator {
 *   @IsOptional()
 *   @IsNumber()
 *   price?: number;
 *
 *   @IsOptional()
 *   @IsNumber()
 *   stock?: number;
 * }
 *
 * // Create GTE DTO
 * class ProductGteDto extends createGteDto(ProductGteValidator) {}
 *
 * // Usage:
 * const dto = new ProductGteDto();
 * dto.gte = {
 *   price: 100, // Will match records with price >= 100
 *   stock: 50 // Will match records with stock >= 50
 * };
 * ```
 *
 * @note The gte object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass. Use this for "greater than or equal"
 * numeric comparisons.
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
