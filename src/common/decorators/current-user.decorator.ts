import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (
    data: keyof Pick<User, 'username' | 'roleId' | 'id'> | 'sub',
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (data === 'id') data = 'sub';
    return data ? user?.[data] : user;
  },
);
