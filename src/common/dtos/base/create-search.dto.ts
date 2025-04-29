import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generates a DTO class that adds a typed `search` field with validation.
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
