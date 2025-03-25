import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export interface CurrentUserData {
  sub: User['id'];
  username: User['username'];
  roleId: User['roleId'];
}

export const CurrentUser = createParamDecorator((data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
