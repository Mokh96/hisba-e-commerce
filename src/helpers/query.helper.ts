import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class QueryHelper {
  fromDtoToQuery(queryDto: object) {
    for (const key in queryDto)
      queryDto[key] = Array.isArray(queryDto[key])
        ? In(queryDto[key])
        : queryDto[key];

    return queryDto;
  }
}
