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

export function convertBoolean() {
  return Transform(({ value }) => {
    switch (value) {
      case 'true' || true:
        return true;
      case 'false' || false:
        return false;
      case 'null' || null:
        return null;
    }
  });
}

export function convertNullNumber() {
  return Transform(({ value }) => {
    switch (value) {
      case 'null' || null:
        return null;
    }
    return value;
  });
}
