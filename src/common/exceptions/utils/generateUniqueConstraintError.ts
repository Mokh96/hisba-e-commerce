import { SENSITIVE_FIELDS } from '../constants/sensitive-fields.constant';

interface UniqueConstraintErrorParams {
  field: string;
  value?: string;
  safeLabel?: string;
}

export function generateUniqueConstraintError({ field, value, safeLabel }: UniqueConstraintErrorParams) {
  const isSensitive = SENSITIVE_FIELDS.includes(field);
  const label = safeLabel ?? field;

  const message = isSensitive || !value ? `This ${label} is already taken` : `The ${label} '${value}' is already taken`;

  return {
    field,
    message,
  };
}
