import { IsArray, IsOptional } from 'class-validator';
import { EntityWithAttributes, IsValidFieldFor } from 'src/common/decorators/validators/validate-fields.decorator';

/**
 * Creates a DTO class with a `fields` array, validated against the given entity.
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
