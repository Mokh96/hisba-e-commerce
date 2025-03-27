import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFormDataArrayPipe<T> implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): T[] {
    //Ensure the input is form-data (object) and not an array
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('The request must be form data (object format).');
    }

    const transformedArray = this.parseFormDataToArray<T>(value);

    if (!Array.isArray(transformedArray) || transformedArray.length === 0) {
      throw new BadRequestException('Invalid request format: Expected a non-empty array.');
    }

    return transformedArray;
  }

  private parseFormDataToArray<T>(body: any): T[] {
    const resultMap = new Map<number, any>();

    Object.keys(body).forEach((key) => {
      const match = key.match(/\[(\d+)]\[(.+)]/); // Match [index][property]
      if (match) {
        const index = parseInt(match[1], 10);
        const propertyPath = match[2];

        if (!resultMap.has(index)) {
          resultMap.set(index, {}); // Initialize an object for each index
        }

        this.setNestedProperty(resultMap.get(index), propertyPath, body[key]);
      }
    });

    if (resultMap.size === 0) {
      throw new BadRequestException('Invalid request format: Expected an array structure.');
    }

    return Array.from(resultMap.values()) as T[];
  }

  private setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split(/\]\[|\[|\]/).filter(Boolean); // Split nested keys properly
    let current = obj;

    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        current[key] = this.castValue(value);
      } else {
        current[key] = current[key] || (isNaN(Number(keys[i + 1])) ? {} : []);
        current = current[key];
      }
    });
  }

  private castValue(value: any): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && value.trim() !== '') return Number(value);
    return value;
  }
}
