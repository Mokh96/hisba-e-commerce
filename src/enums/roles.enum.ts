// enums in typescript are dangerous !!!
export enum roles {
  SUPERADMIN = 1,
  ADMIN = 2,
  CLIENT = 3,
  DELEGATE = 4,
}

/**
 * Represents an object containing role identifiers.
 * Each property corresponds to a role and holds its respective ID value.
 * @returns {Object}
 */
export const Roles = {
  SUPERADMIN: 1,
  ADMIN: 2,
  CLIENT: 3,
};

/**
 * Represents an object containing role identifiers.
 * Each property corresponds to a role ID and holds its respective role name.
 * @returns {Object}
 */
export const RolesInverse = Object.fromEntries(
  Object.entries(Roles).map(([key, value]) => [value, key]),
);
