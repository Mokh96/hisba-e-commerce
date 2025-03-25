// enums in typescript are dangerous !!!
export enum Roles {
  SUPERADMIN = 1,
  ADMIN = 2,
  CLIENT = 3,
  DELEGATE = 4,
}

/**
 * Converts the Roles enum to a normal object.
 * Since TypeScript enums also map values back to keys,
 * we need to filter out numeric keys.
 * @returns {Object} The Roles enum as an object
 */
export const rolesObject = Object.keys(Roles)
  .filter((key) => isNaN(Number(key))) // Filter out numeric keys
  .reduce((acc, key) => {
    acc[key] = Roles[key as keyof typeof Roles];
    return acc;
  }, {} as Record<string, number>);

/**
 * Represents an object containing role identifiers.
 * Each property corresponds to a role ID and holds its respective role name.
 * @returns {Object}
 */
export const inverseRolesObject = Object.keys(rolesObject).reduce((acc, key) => {
  const value = rolesObject[key];
  acc[value] = key;
  return acc;
}, {} as Record<number, string>);
