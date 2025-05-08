// helpers/form-data-parser.helpers.ts
import { BadRequestException } from '@nestjs/common';

/**
 * Parses a flat `form-data` style object into a structured array of objects.
 *
 * This is useful for converting incoming multipart/form-data requests with indexed keys
 * like `[0][property]`, `[0][nested][field]`, etc., into structured JSON arrays.
 *
 * @template T - The expected shape of the resulting objects.
 * @param {Record<string, any>} body - The incoming request body from form-data (e.g., `req.body`).
 * @returns {T[]} An array of structured objects based on the form-data keys.
 *
 * @throws {BadRequestException} If the body is not a valid object or array structure is missing.
 *
 * @example
 * // Form Data:
 * // [0][syncId]: 123
 * // [0][name]: "Product A"
 * // [0][article][0][title]: "Article 1"
 * // [1][syncId]: 456
 * // [1][name]: "Product B"
 *
 * const result = parseFormDataToArray(req.body);
 * // Output:
 * [
 *   {
 *     syncId: 123,
 *     name: "Product A",
 *     article: [
 *       { title: "Article 1" }
 *     ]
 *   },
 *   {
 *     syncId: 456,
 *     name: "Product B"
 *   }
 * ]
 */
export function parseFormDataToArray<T = any>(body: Record<string, any>): T[] {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('The request must be form data (object format).');
  }

  const resultMap = new Map<number, any>();

  Object.keys(body).forEach((key) => {
    const match = key.match(/\[(\d+)]\[(.+)]/); // Match [index][property]
    if (match) {
      const index = parseInt(match[1], 10);
      const propertyPath = match[2];

      if (!resultMap.has(index)) {
        resultMap.set(index, {});
      }

      setNestedProperty(resultMap.get(index), propertyPath, body[key]);
    }
  });

  if (resultMap.size === 0) {
    throw new BadRequestException('Invalid request format: Expected an array structure.');
  }

  return Array.from(resultMap.values());
}

function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split(/\]\[|\[|\]/).filter(Boolean);
  let current = obj;

  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      current[key] = castValue(value);
    } else {
      current[key] = current[key] || (isNaN(Number(keys[i + 1])) ? {} : []);
      current = current[key];
    }
  });
}

function castValue(value: any): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value) && value.trim() !== '') return Number(value);
  return value;
}
