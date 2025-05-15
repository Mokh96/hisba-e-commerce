import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

function IsNullablePositiveIntArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNullablePositiveIntArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          return value.every((v) => v === null || (Number.isInteger(v) && v > 0));
        },
        defaultMessage() {
          return `${propertyName} must be an array of positive integers or nulls`;
        },
      },
    });
  };
}

export default IsNullablePositiveIntArray;
