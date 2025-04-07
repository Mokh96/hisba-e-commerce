import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { parseFormDataToArray } from '../utils/form-data-parser.util';

@Injectable()
export class ParseFormDataArrayPipe<T> implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): T[] {
    try {
      return parseFormDataToArray<T>(value);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
