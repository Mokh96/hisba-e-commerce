import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { translate } from 'src/startup/i18n/i18n.provider';

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
          return translate('validation.isNullablePositiveIntArray', { args: { propertyName } }) as string;
        },
      },
    });
  };
}

export default IsNullablePositiveIntArray;
