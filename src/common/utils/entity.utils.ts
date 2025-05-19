import { FindManyOptions, In, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { merge } from 'lodash';

interface EntityWithId<IdType extends string | number = string | number> {
  id: IdType;
}

export async function getEntitiesByIds<T extends EntityWithId>(
  repository: Repository<T>,
  ids: T['id'][] =[],
  options: FindManyOptions<T> = {},
): Promise<T[]> {
  if (ids.length === 0) {
    return [];
  }

  // Clone and ensure `id` is included in select if defined
  const patchedOptions: FindManyOptions<T> = { ...options };

  if (patchedOptions.select) {
    patchedOptions.select = {
      ...patchedOptions.select,
      id: true as any, // force select id
    };
  }

  const mergedOptions: FindManyOptions<T> = merge({}, patchedOptions, {
    where: { id: In(ids) },
  });

  const tableName = repository.metadata.tableName.toLowerCase();
  const items = await repository.find(mergedOptions);

  const foundIds = new Set(items.map((item) => item.id));
  const missingIds = ids.filter((id) => !foundIds.has(id));

  if (missingIds.length > 0) {
    throw new BadRequestException(`${tableName} not found: ${missingIds.join(', ')}`);
  }

  return items;
}
