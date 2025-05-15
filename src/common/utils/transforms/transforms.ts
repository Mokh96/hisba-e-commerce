import { TransformFnParams } from 'class-transformer/types/interfaces/metadata/transform-fn-params.interface';

export function parseNumberOrNull(value: TransformFnParams['value']): number | null {
  if (value === 'null') return null;

  const parsed = Number(value);
  return isNaN(parsed) ? value : parsed;
}
