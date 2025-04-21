import { TransformStringToBoolean } from 'src/common/decorators';
import { IsBoolean, IsOptional } from 'class-validator';

export class RemoveImageDto {
  @TransformStringToBoolean({ allowNull: false })
  @IsBoolean()
  @IsOptional()
  removeImage: boolean;
}