import { ColumnOptions } from 'typeorm';

export const defaultDecimal: ColumnOptions = {
  type: 'decimal',
  precision: 18,
  scale: 2,
};
