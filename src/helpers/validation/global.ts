import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatSyncBrandDto } from 'src/modules/brands/dto/createSync-brand.dto';
import { CreateSyncCategoryDto } from 'src/modules/categories/dto/createSync-brand.dto';
import { CreateSyncFamilyDto } from 'src/modules/families/dto/createSync-familt.dto';

class ValidationFailuresType {
  index: number;
  message: string;
}
type CommonInterface =
  | CreatSyncBrandDto[]
  | CreateSyncCategoryDto[]
  | CreateSyncFamilyDto[];
export const validateBulkInsert = async <T extends CommonInterface>(
  data: any[],
  type: 'category' | 'brand' | 'family',
): Promise<{
  validatedData: CommonInterface;
  failureData: ValidationFailuresType[];
}> => {
  const validatedData: CommonInterface = [];
  const failureData: ValidationFailuresType[] = [];
  const plainToInstanceClass =
    type === 'category'
      ? CreateSyncCategoryDto
      : type === 'brand'
      ? CreatSyncBrandDto
      : CreateSyncFamilyDto;
  let i: number = 0;
  for (const item of data) {
    const validatedItem = plainToInstance(plainToInstanceClass, item); // Enable strict transformation

    const errors = await validate(validatedItem);

    if (errors.length === 0) {
      validatedData.push({
        label: validatedItem.label,
        syncId: validatedItem.syncId,
        parentId: validatedItem.parentId,
      });
    } else {
      failureData.push({ index: i, message: 'this item not valide' });
    }
    i++;
  }

  return { validatedData, failureData };
};
