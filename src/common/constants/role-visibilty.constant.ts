import { Roles } from '../enums/roles.enum';

export const RoleVisibilityMap: Record<Roles, Roles[]> = {
  [Roles.SUPERADMIN]: [Roles.ADMIN, Roles.COMPANY],
  [Roles.ADMIN]: [Roles.COMPANY],
  [Roles.COMPANY]: [],
  [Roles.CLIENT]: [],
};
