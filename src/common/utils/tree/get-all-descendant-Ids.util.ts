import { In, Repository } from 'typeorm';

type EntityWithParent = {
  id: number;
  parentId: number | null;
};

/**
 * Recursively collects the IDs of the given parent entities and all their descendants.
 *
 * @param initialParentIds - The root parent ID(s) to search from
 * @param repository - A TypeORM repository of an entity that includes parentId
 * @returns All IDs including descendants and the original parent IDs
 */
export async function getAllDescendantIds<T extends EntityWithParent>(
  initialParentIds: number[],
  repository: Repository<T>,
): Promise<number[]> {
  if (!initialParentIds || !initialParentIds.length) {
    return [];
  }

  const visited = new Set<number>();
  const result: number[] = [];
  let queue = [...initialParentIds];

  while (queue.length) {
    const currentBatch = queue;
    queue = [];

    for (const id of currentBatch) {
      if (!visited.has(id)) {
        visited.add(id);
        result.push(id);
      }
    }

    const children = await repository.find({
      select: ['id', 'parentId'] as (keyof T)[],
      where: {
        parentId: In(currentBatch),
      } as any, // TypeORM is not good at inferring `In` with generics
    });

    for (const child of children) {
      if (!visited.has(child.id)) {
        queue.push(child.id);
      }
    }
  }

  return result;
}
