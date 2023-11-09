import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { LabelCommonDto } from 'src/common-dtos/label.common.dto';

export class CreateFamilyDto extends LabelCommonDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId: number;
}

export class CreateSyncFamilyDto extends CreateFamilyDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  syncId: number;
}
