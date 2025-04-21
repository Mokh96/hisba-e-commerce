import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { Client } from 'src/modules/clients/entities/client.entity';

export interface CurrentUserData {
  sub: User['id'];
  username: User['username'];
  roleId: User['roleId'];
  client?: Pick<Client, 'id'>;// only for clients
}

export const CurrentUser = createParamDecorator((data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
