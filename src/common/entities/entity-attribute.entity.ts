import { MixinConstructor } from 'src/common/types/entities.types';
import { getMetadataArgsStorage } from 'typeorm';

/**
 * A mixin that adds utility methods for extracting entity attributes and properties
 * from TypeORM entities. This helps with dynamic property retrieval across the inheritance chain.
 *
 *
 * @example
 * ```ts
 * // Create a mixed entity with utility methods
 * const MixedEntity = WithEntityAttributeUtils(BaseEntity);
 *
 * // Use in an entity class
 * @Entity()
 * export class User extends MixedEntity {
 *   @Column()
 *   name: string;
 *
 *   @Column()
 *   email: string;
 * }
 *
 * // Later use the static methods
 * const attributes = User.getEntityAttributes(); // Returns ['id', 'name', 'email', ...]
 * const selectObj = User.getSelectableAttributes(); // Returns {id: true, name: true, email: true, ...}
 * ```
 * @param Base - The base class to extend with entity attribute utilities
 * @returns A new class with entity attribute utility methods
 */
export function WithEntityAttributeUtils<TBase extends MixinConstructor>(Base: TBase) {
  class EntityAttributeUtils extends Base {
    /**
     * Gets all attributes (properties but not relations) of the entity class,
     * including inherited properties from parent classes and mixins.
     *
     * @returns An array of attribute names defined as columns in the entity
     *
     * @example
     * ```ts
     * // Get all attributes of User entity
     * const attributes = User.getEntityAttributes();
     * // Returns: ['id', 'createdAt', 'updatedAt', 'name', 'email', ...]
     * ```
     */
    static getEntityAttributes(): string[] {
      const metadata = getMetadataArgsStorage();
      const entityClass = this;

      // Get all columns for the entity and its parent classes
      const columns = metadata.columns.filter(
        (column) => {
          // Check if the column belongs to the entity or any of its parent classes
          const target = column.target;
          let currentClass = entityClass;

          // Check if this column's target is the current class or any parent in the inheritance chain
          while (currentClass && currentClass !== Object.prototype) {
            if (target === currentClass || target.constructor === currentClass) {
              return true;
            }
            currentClass = Object.getPrototypeOf(currentClass);
          }
          return false;
        }
      );

      // Similarly, check relations in the entity and its parent classes
      const relations = metadata.relations.filter(
        (relation) => {
          const target = relation.target;
          let currentClass = entityClass;

          while (currentClass && currentClass !== Object.prototype) {
            if (target === currentClass || target.constructor === currentClass) {
              return true;
            }
            currentClass = Object.getPrototypeOf(currentClass);
          }
          return false;
        }
      );

      const relationNames = relations.map((relation) => relation.propertyName);

      // Return only the column names that are not relations
      return columns
        .map((column) => column.propertyName)
        .filter((name) => !relationNames.includes(name));
    }

    /**
     * Creates an object with all entity attributes as keys and `true` as values.
     * This is useful for property selection in various contexts, such as
     * generating dynamic selection objects or for ORM queries.
     *
     * @returns An object with all entity attributes mapped to `true` values
     *
     * @example
     * ```ts
     * // For a User entity with id, name, email properties
     * const selectObj = User.getSelectableAttributes();
     * // Returns: {id: true, name: true, email: true}
     * ```
     * @example
     * ```ts
     * // Use with TypeORM select
     * const users = await userRepository.find({
     *   select: User.getSelectableAttributes(),
     *   where: { active: true }
     * });
     * ```
     */
    static getSelectableAttributes(): Record<string, true> {
      const attributes = this.getEntityAttributes();
      return Object.fromEntries(attributes.map((attr) => [attr, true]));
    }
  }

  return EntityAttributeUtils;
}