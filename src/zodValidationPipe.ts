import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      //   console.log(value);
      //   console.log(metadata);
      //   console.log(this.schema);

      //console.log(this.schema.parse(value));

      this.schema.parse(value);
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ code: '123', message: 'for testing' });
    }
    return value;
  }
}

