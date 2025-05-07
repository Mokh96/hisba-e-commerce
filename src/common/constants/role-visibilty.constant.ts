import { Role } from '../enums/roles.enum';

export const RoleVisibilityMap: Record<Role, Role[]> = {
  [Role.SUPERADMIN]: [Role.ADMIN, Role.COMPANY],
  [Role.ADMIN]: [Role.COMPANY],
  [Role.COMPANY]: [],
  [Role.CLIENT]: [],
};
