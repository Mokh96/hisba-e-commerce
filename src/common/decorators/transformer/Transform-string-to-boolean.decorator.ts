import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

/**
 * Transforms string values from form data to boolean or null values.
 *
 * @param props Configuration options
 * @param props.allowNull Whether to allow 'null' as a valid value (defaults to true)
 * @returns A property decorator that transforms 'true'/'false'/'null' strings to their respective types
 *
 * @example
 * // Allow boolean or null (default)
 * @TransformStringToBoolean({ allowNull: true })
 * @IsBoolean()
 * @IsOptional()
 * isActive: boolean | null;
 *
 * @example
 * // Only allow true/false (no null)
 * @TransformStringToBoolean({ allowNull: false })
 * @IsBoolean()
 * isRequired: boolean;
 *
 * @throws BadRequestException if the value is not one of the accepted string values
 */
export function TransformStringToBoolean(props?: { allowNull?: boolean }) {
  const { allowNull = true } = props || {};
  const acceptValues = allowNull ? ['true', 'false', 'null'] : ['true', 'false'];
  return Transform(
    ({ value, obj, key }) => {
      const target = obj[key];
      if (target === 'true') return true;
      if (target === 'false') return false;
      if (target === 'null') return null;

      throw new BadRequestException(`${key} must be '${acceptValues.join(', ')}'.`);
    },
    { toClassOnly: true },
  );
}

export default TransformStringToBoolean;
