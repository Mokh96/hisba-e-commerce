import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

export function createEwFilterDto<S extends object>(ValidatorClass: new () => S) {
  class EwFilterDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    ew?: S = {} as S;
  }

  return EwFilterDto;
}
