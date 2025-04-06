// interceptors/parse-form-data.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { parseFormDataToArray } from 'src/common/utils/form-data-parser.util';

/**
 * Interceptor to convert incoming form-data into structured JSON objects.
 *
 * This interceptor processes incoming requests with form data and ensures that
 * the data is properly converted into a structured array of objects.
 *
 * Example:
 * - Input (raw form data):
 *    - [0][_uid]: '123'
 *    - [0][name]: 'Product A'
 *    - [1][_uid]: '456'
 *    - [1][name]: 'Product B'
 *
 * - Output (parsed JSON):
 *    ```json
 *    [
 *      {
 *        "_uid": "123",
 *        "name": "Product A"
 *      },
 *      {
 *        "_uid": "456",
 *        "name": "Product B"
 *      }
 *    ]
 *    ```
 *
 * This interceptor should be used before any validation or further processing logic
 * to ensure the data is in the expected format.
 */
@Injectable()
export class ParseFormDataArrayInterceptor implements NestInterceptor {
  /**
   * Intercepts the request and transforms the body to a structured array of objects.
   *
   * @param {ExecutionContext} context - The execution context, used to access the request body.
   * @param {CallHandler} next - The next handler to pass the transformed request to.
   * @returns {Observable<any>} The modified request body, transformed into a structured array.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    try {
      request.body = parseFormDataToArray(request.body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return next.handle();
  }
}
