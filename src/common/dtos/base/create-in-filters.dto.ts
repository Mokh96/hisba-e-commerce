import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Generates a DTO class with a typed `in` field for filtering with array values.
 *
 * @param ValidatorClass - A class containing the validation rules for in-filter fields
 * @returns A DTO class with in filters object property
 *
 * @example
 * ```TypeScript
 * // Define in-filter validator
 * class ProductInFiltersValidator {
 *   @IsOptional()
 *   @IsArray()
 *   @IsNumber({}, { each: true })
 *   categoryIds?: number[];
 *
 *   @IsOptional()
 *   @IsArray() 
 *   @IsString({ each: true })
 *   brands?: string[];
 * }
 *
 * // Create in-filters DTO
 * class ProductInFiltersDto extends createInFiltersDto(ProductInFiltersValidator) {}
 *
 * // Usage:
 * const dto = new ProductInFiltersDto();
 * dto.in = {
 *   categoryIds: [1, 2, 3],
 *   brands: ['nike', 'adidas']
 * };
 * ```
 *
 * @note The in object is optional but when provided, must validate against the rules
 * defined in the ValidatorClass. Typically used for filtering by arrays of values.
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
