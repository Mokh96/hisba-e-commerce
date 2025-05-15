import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

/**
 * Interceptor to validate an array of DTOs in the request body.
 *
 * This is useful for bulk operations where the client sends an array of objects
 * (e.g., creating multiple products in a single request).
 *
 * This interceptor uses `class-transforms` and `class-validator` to:
 * - Transform each item in the array into an instance of the provided DTO class.
 * - Validate each instance.
 * - Collect and throw detailed validation errors with index-based mapping.
 *
 * ⚠️ **Important**: This interceptor assumes the request body has already been parsed
 * and transformed into an array of objects (e.g., via a form-data parsing interceptor).
 * Therefore, it **must be used after** such interceptors in the chain.
 *
 * ### Example request (form-data):
 *
 * ```
 * [0][code]: PRD-001
 * [0][label]: First Product
 * [1][label]: Missing code
 * ```
 *
 * ### Example validation error response:
 * ```json
 * {
 *   "message": "Validation failed for one or more items",
 *   "errors": [
 *     {
 *       "index": 1,
 *       "messages": [
 *         {
 *           "property": "code",
 *           "constraints": {
 *             "isNotEmpty": "code should not be empty"
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
@Injectable()
export class ValidateBulkDtoInterceptor<T extends object> implements NestInterceptor {
  constructor(private readonly dto: Type<T>) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const body: T = request.body;

    if (!Array.isArray(body) || !body.every((item) => typeof item === 'object')) {
      throw new BadRequestException('Expected request body to be an array of objects');
    }

    const errors: string[] = [];

    for (const [index, item] of body.entries()) {
      const instance = plainToInstance(this.dto, item);
      const validationErrors = await validate(instance);
      const flatMap = validationErrors.flatMap((error) => {
        return error.constraints ? Object.values(error.constraints) : [];
      });

      errors.push(...flatMap);
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: errors,
      });
    }

    return next.handle();
  }
}
