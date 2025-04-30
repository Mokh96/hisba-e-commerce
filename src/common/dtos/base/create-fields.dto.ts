import { IsArray, IsOptional } from 'class-validator';
import { EntityWithAttributes, IsValidFieldFor } from 'src/common/decorators/validators/validate-fields.decorator';


/**
 * Creates a DTO class with a `fields` array property that is validated against the given entity's attributes.
 *
 * @param entity - An entity class implementing EntityWithAttributes interface
 * @returns A DTO class with fields array property
 *
 * @example
 * ```typescript
 * // Product entity implements EntityWithAttributes
 * class ProductFieldsDto extends createFieldsDto(Product) {}
 *
 * // Usage:
 * const dto = new ProductFieldsDto();
 * dto.fields = ['id', 'name', 'price']; // Valid if these fields exist on Product
 * dto.fields = ['invalid']; // Will fail validation
 * ```
 *
 * @note The fields array is optional but when provided, each field must be a valid
 * attribute of the entity as returned by its getEntityAttributes() method
 */
export function createFieldsDto<T>(entity: EntityWithAttributes) {
  class FieldsDto {
    @IsOptional()
    @IsArray()
    @IsValidFieldFor(entity)
    fields?: (keyof T)[];
  }

  return FieldsDto;
}
