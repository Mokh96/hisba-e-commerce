import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Validates an array of objects against a given DTO.
 * @param data The array of objects to validate
 * @param dto The DTO class to validate against
 * @returns An object with two properties: valSuccess and valFailures.
 * valSuccess is an array of objects that were successfully validated.
 * valFailures is an array of objects that failed validation, with the index of the
 * failure, the syncId of the failure, and an array of errors for each failure.
 * Each error has a property, value, and message.
 */
export async function validateBulkDto<TDto extends object>(data: TDto[], dto: new () => TDto) {
  const valFailures = [];

  const valSuccess = [];

  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    // Convert the plain object to an instance of the DTO
    const instance = plainToInstance(dto, item);

    const errors = await validate(instance);

    if (errors.length === 0) {
      valSuccess.push(instance);
    } else {
      // If validation errors, push to valFailures array with index and errors
      valFailures.push({
        index,
        syncId: errors[0].target['syncId'],
        errors: errors.map(({ constraints }) => Object.values(constraints || {})[0]),
      });
    }
  }

  return { valSuccess, valFailures };
}
