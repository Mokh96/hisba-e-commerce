import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generates a DTO class with a typed `filters` field for general field filtering.
 */
/**
 * Generates a DTO class with a typed `filter` field for general field filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for filter fields
 * @returns A DTO class with filters object property
 *
 * @example
 * ```TypeScript
 * // Define filter validator
 * class ProductFiltersValidator {
 *   @IsOptional()
 *   @IsBoolean()
 *   isActive?: boolean;
 *
 *   @IsOptional() 
 *   @IsNumber()
 *   price?: number;
 * }
 *
 * // Create filters DTO
 * class ProductFiltersDto extends createFiltersDto(ProductFiltersValidator) {}
 *
 * // Usage:
 * const dto = new ProductFiltersDto();
 * dto.filters = {
 *   isActive: true,
 *   price: 100
 * };
 * ```
 *
 * @note The filters object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass
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
