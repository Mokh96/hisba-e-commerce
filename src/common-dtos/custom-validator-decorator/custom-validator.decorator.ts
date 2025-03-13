import { Transform } from 'class-transformer';
import {
  IsBoolean,
  NotEquals,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

export function IsNotUndefine(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== undefined, validationOptions);
}

export function IsBooleanDontAcceptNull(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    ValidateIf((_object, value) => value !== undefined)(target, propertyKey);
    IsBoolean()(target, propertyKey);
    NotEquals(null)(target, propertyKey);
  };
}

//TODO: need to check this
export function convertBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'boolean') return value;

    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      case 'null':
        return null;
    }
  });
}

//TODO: need to check this
export function convertNullNumber() {
  return Transform(({ value }) => {
    if (value === 'null' || value === null) return null;
    return value;
  });
}
