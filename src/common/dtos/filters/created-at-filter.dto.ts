import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';

export class CreatedAtFilterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  createdAt?: DateRangeDto;
}