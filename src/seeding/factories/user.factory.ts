import { Roles } from '../../enums/roles.enum';
import { User } from '../../modules/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
// @ts-expect-error
export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.username = faker.internet.userName();
  user.password = faker.internet.password();
  user.roleId = Roles.CLIENT;
  return user;
});
