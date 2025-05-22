import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

export function createSwFilterDto<S extends object>(ValidatorClass: new () => S) {
  class SwFilterDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    sw?: S = {} as S;
  }

  return SwFilterDto;
}
