import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/common/dtos/filters/date-rang.dto';


/**
 * DTO class for date range filtering on createdAt and updatedAt fields.
 *
 * @example
 * ```typescript
 * const dto = new DateRangeFiltersDto();
 * dto.createdAt = {
 *   from: '2023-01-01T00:00:00Z', 
 *   to: '2023-12-31T23:59:59Z'
 * };
 * dto.updatedAt = {
 *   from: '2023-06-01T00:00:00Z'
 *   // to is optional
 * };
 * ```
 *
 * @note Both createdAt and updatedAt are optional. When provided, they must be
 * valid DateRangeDto objects with ISO 8601 date strings.
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
