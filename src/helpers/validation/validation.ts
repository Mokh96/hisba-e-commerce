import { plainToInstance } from 'class-transformer';
import { validate , } from 'class-validator';

export async function validateBulk(data: object[], dto: any) {
  const valFailures = [];
  const valSuccess: (typeof dto)[] = [];

  for (const item of data) {
    const convertedItem: object = plainToInstance(dto, item);

    const errors = await validate(convertedItem);

    if (errors.length === 0) valSuccess.push(convertedItem);
    else valFailures.push({ index: data.indexOf(item), errors });
  }

  return { valSuccess, valFailures };
}
