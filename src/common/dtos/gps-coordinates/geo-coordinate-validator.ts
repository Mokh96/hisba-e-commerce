import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';


/**
 * Validator for latitude values
 * Checks if a latitude value is within the valid range of -90 to 90 degrees.
 */
@ValidatorConstraint({ name: 'IsValidLatitude', async: false })
export class IsValidLatitudeConstraint implements ValidatorConstraintInterface {
  validate(latitude: number, args: ValidationArguments) {
    return latitude >= -90 && latitude <= 90;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Latitude must be between -90 and 90';
  }
}

export function IsValidLatitude(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidLatitudeConstraint,
    });
  };
}

/**
 * Validator for longitude values
 * Checks if a longitude value is within the valid range of -180 to 180 degrees.
 * */
@ValidatorConstraint({ name: 'IsValidLongitude', async: false })
export class IsValidLongitudeConstraint implements ValidatorConstraintInterface {
  validate(longitude: number, args: ValidationArguments) {
    return longitude >= -180 && longitude <= 180;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Longitude must be between -180 and 180';
  }
}

export function IsValidLongitude(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidLongitudeConstraint,
    });
  };
}
