import { IsNumber, IsOptional } from 'class-validator';
import { IsValidLatitude, IsValidLongitude } from 'src/common/dtos/gps-coordinates/geo-coordinate-validator';

export class gpsCoordinatesDto {
  @IsOptional()
  @IsNumber()
  @IsValidLatitude() // Custom validation for latitude
  latitude: number | null = null;

  @IsOptional()
  @IsNumber()
  @IsValidLongitude() // Custom validation for longitude
  longitude: number | null = null;
}
