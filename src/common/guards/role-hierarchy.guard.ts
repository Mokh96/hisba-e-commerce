import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
/**
 * Guard that checks if the logged user has a higher or equal role than the target user.
 *
 * The target user is the user that is being accessed in the route.
 */
@Injectable()
export class RoleHierarchyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const currentUser = request.user;
    const targetUserId = +request.params.id;

    if (!currentUser || !targetUserId) return false;

    // Load the target user (from DB or service)
    const targetUser = await this.usersService.findUserById(targetUserId);
    if (!targetUser) throw new ForbiddenException('Target user not found');

    const currentLevel = currentUser.roleId;
    const targetLevel = targetUser.roleId;

    // Allow if current user has higher role than the target
    if (currentLevel < targetLevel) return true;

    throw new ForbiddenException('You do not have permission to perform this action');
  }
}
