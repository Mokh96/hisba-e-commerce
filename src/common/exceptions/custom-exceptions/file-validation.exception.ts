import { ErrorType } from 'src/common/exceptions/enums/error-type.enum';
import { BadRequestException } from '@nestjs/common';

export class FileValidationException extends BadRequestException {
  constructor(
    public readonly field: string,
    public readonly message: string,
    public readonly type: ErrorType,
    public readonly meta?: Record<string, any>,
  ) {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message,
      type,
      field,
      ...(meta ? { meta } : {}),
    });
  }
}
