import { Type } from 'class-transformer';
import { IsOptional, IsObject, ValidateNested } from 'class-validator';

export function createNotInDto<N extends object = any>(ValidatorClass: new () => N) {
  class NotInDto {
    @IsOptional()
    @IsObject()
    @Type(() => ValidatorClass)
    @ValidateNested()
    notIn?: N = {} as N;
  }

  return NotInDto;
}
