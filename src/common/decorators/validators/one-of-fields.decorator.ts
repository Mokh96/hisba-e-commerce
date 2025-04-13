import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'OneOfFields', async: false })
export class OneOfFieldsConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const [fields] = args.constraints as [string[]];
    const object = args.object as Record<string, any>;
    return fields.some((field) => {
      const value = object[field];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });
  }

  defaultMessage(args: ValidationArguments) {
    const [fields] = args.constraints as [string[]];
    return `At least one of [${fields.join(', ')}] must be provided.`;
  }
}

export function OneOfFields(fields: string[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'OneOfFields',
      target: constructor,
      constraints: [fields],
      options: validationOptions,
      propertyName: undefined as any, // class-level
      validator: OneOfFieldsConstraint,
    });
  };
}
