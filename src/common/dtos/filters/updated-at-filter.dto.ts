import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';

export class UpdatedAtFilterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  updatedAt?: DateRangeDto;
}