import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Generates a DTO class with a typed `search` field for search-related filtering.
 *
 * @param ValidatorClass - A class containing the validation rules for search fields
 * @returns A DTO class with search object property
 *
 * @example
 * ```TypeScript
 * // Define search validator
 * class ProductSearchValidator {
 *   @IsOptional()
 *   @IsString()
 *   name?: string;
 *
 *   @IsOptional() 
 *   @IsString()
 *   description?: string;
 * }
 *
 * // Create search DTO
 * class ProductSearchDto extends createSearchDto(ProductSearchValidator) {}
 *
 * // Usage:
 * const dto = new ProductSearchDto();
 * dto.search = { 
 *   name: 'phone',
 *   description: 'smartphone'
 * };
 * ```
 *
 * @note The search object is optional but when provided, must validate against
 * the rules defined in the ValidatorClass
 */
export function createSearchDto<S extends object>(ValidatorClass: new () => S) {
  class SearchDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    search?: S = {} as S;
  }

  return SearchDto;
}
