import { Request } from 'express';

export interface RequestOption extends Request {
  filterArray: string[];
  dist: string;
}
