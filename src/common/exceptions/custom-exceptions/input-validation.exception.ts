import { BadRequestException } from '@nestjs/common';

 class InputValidationException extends BadRequestException {
  constructor(public readonly field: string, message: string) {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message,
      type: 'validation_error',
      errors: [{ field, message }],
    });
  }
}
export default InputValidationException
