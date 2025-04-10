import { ColumnOptions } from 'typeorm';

export const decimalColumnOptions: ColumnOptions = {
  type: 'decimal',
  precision: 18,
  scale: 2,
};
