import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';

/**
 * Adds optional `createdAt` and `updatedAt` date range filters.
 */
export class DateRangeFiltersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  createdAt?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  updatedAt?: DateRangeDto;
}
