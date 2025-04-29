import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/*export type EntityWithAttributes = {
  getEntityAttributes: () => string[];
};*/


export type EntityWithAttributes = {
  getEntityAttributes(): string[];
};


@ValidatorConstraint({ async: false })
export class IsValidFieldConstraint implements ValidatorConstraintInterface {
  validate(fields: string[], args: ValidationArguments) {
    const entityClass = args.constraints[0] as EntityWithAttributes;

    if (!entityClass || typeof entityClass.getEntityAttributes !== 'function') {
      throw new Error(`Entity class must have a static getEntityAttributes() method.`);
    }

    const validFields = entityClass.getEntityAttributes();
    return Array.isArray(fields) && fields.every((field) => validFields.includes(field));
  }

  defaultMessage(args: ValidationArguments) {
    const entityClass = args.constraints[0] as EntityWithAttributes;
    const validFields = entityClass?.getEntityAttributes?.() || [];
    return `Each field must be one of the following: ${validFields.join(', ')}`;
  }
}

export function IsValidFieldFor(
  entityClass: EntityWithAttributes,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass],
      validator: IsValidFieldConstraint,
    });
  };
}


