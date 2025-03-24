import { Roles } from 'src/enums/roles.enum';
import { Role } from 'src/modules/roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager, useSeederFactory } from 'typeorm-extension';
import { User } from 'src/modules/users/entities/user.entity';
import { hash, genSalt } from 'bcrypt';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    /**
     * Seed Roles
     */

    const roleRepo = dataSource.getRepository(Role);

    console.log('Seeding Roles ...');

    await roleRepo.save(
      Object.entries(Roles).map(([key, roleId]) => ({
        id: +roleId,
        label: key,
      })),
    );

    /**
     * Seed Users
     */

    console.log('Seeding Admins ...');
    const userRepo = dataSource.getRepository(User);
    const salt = await genSalt(10);
    const password = await hash('123456', salt);
    await userRepo.save([
      {
        username: 'superadmin',
        password,
        roleId: Roles.SUPERADMIN,
      },
      {
        username: 'admin',
        password,
        roleId: Roles.ADMIN,
      },
    ]);

    /**
    * ! Cancelled Because .. 
 
    console.log('Seeding Users ...');

    const userFactory = await factoryManager.get(User);

    const users = await userFactory.saveMany(10);

    console.log('Seeding Clients ...');

    const clientRepo = dataSource.getRepository(Client);
    const ClientFactory = await useSeederFactory(Client);

    const clients = await Promise.all(
      Array(10)
        .fill('')
        .map(async () => {
          const client = await ClientFactory.make({
            user: faker.helpers.arrayElement(users),
            creator: faker.helpers.arrayElement(admins),
          });
          return client;
        }),
    );

    await clientRepo.save(clients);*/
  }
}
