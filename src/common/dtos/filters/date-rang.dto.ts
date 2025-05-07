import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: 'from must be a valid ISO 8601 date string' })
  from?: string; // Start date of the range

  @IsOptional()
  @IsDateString({}, { message: 'to must be a valid ISO 8601 date string' })
  to?: string; // End date of the range
}
