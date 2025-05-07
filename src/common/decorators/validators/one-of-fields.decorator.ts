import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  createFieldPrefixedMessage
} from 'src/common/exceptions/filters/validation-exception-filter/validation-exception-util';


/**
 * Custom class-level validator that checks if at least one of the specified fields
 * in the object has a truthy value or a non-empty array.
 *
 * Usage example:
 *
 * ```ts
 * @OneOfFields(['email', 'phone'], { message: 'Either email or phone must be provided.' })
 * class ContactDto {
 *   email?: string;
 *   phone?: string;
 * }
 * ```
 */
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
    const baseMessage = `You must provide at least one of ${fields.join(' or ')}.`;
    return createFieldPrefixedMessage(fields, baseMessage);
  }
}

/**
 * Decorator to apply the `OneOfFieldsConstraint` at the class level.
 * Ensures that at least one of the given fields is defined and non-empty.
 *
 * @param fields - Array of field names to check.
 * @param validationOptions - Optional validation options including a custom message.
 */
export function OneOfFields(fields: string[], validationOptions?: ValidationOptions) {
  // If a custom message is provided, prefix it with field information
  if (validationOptions?.message && typeof validationOptions.message === 'string'
    && !validationOptions.message.startsWith('__')) {
    validationOptions.message = createFieldPrefixedMessage(fields, validationOptions.message);
  }

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

