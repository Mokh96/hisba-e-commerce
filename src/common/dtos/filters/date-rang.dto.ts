import { IsDateString, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: 'validation.isDateString' })
  from?: string; // Start date of the range

  @IsOptional()
  @IsDateString({}, { message: 'validation.isDateString' })
  to?: string; // End date of the range
}
