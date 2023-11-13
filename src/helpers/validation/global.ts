import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSyncBrandDto } from 'src/modules/brands/dto/create-brand.dto';
import { CreateSyncCategoryDto } from 'src/modules/categories/dto/create-category.dto';
import { CreateSyncFamilyDto } from 'src/modules/families/dto/create-family.dto';

class ValidationFailuresType {
  index: number;
  message: string;
}

type CommonInterface =
  | CreateSyncBrandDto[]
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
      ? CreateSyncBrandDto
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
      failureData.push({ index: i, message: 'this item not valid' });
    }
    i++;
  }

  return { validatedData, failureData };
};
