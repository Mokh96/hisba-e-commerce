import { genSalt, hash } from 'bcrypt';
import { Roles, rolesObject } from 'src/enums/roles.enum';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Town } from 'src/modules/towns/entities/town.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Wilaya } from 'src/modules/wilayas/entities/wilaya.entity';
import { townsList, wilayasList } from 'src/seeding/data/wilayas-towns';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    /**
     * Seed Roles
     */

    const roleRepo = dataSource.getRepository(Role);

    console.log('Seeding Roles ...');

    await roleRepo.save(
      Object.entries(rolesObject).map(([key, roleId]) => ({
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
      {
        username: 'company',
        password,
        roleId: Roles.COMPANY,
      },
    ]);

    /**
     * Seed Wilayas and towns*/

    console.log('Seeding Wilayas  ...');
    const wilayasRepo = dataSource.getRepository(Wilaya);
    await wilayasRepo.save(wilayasList);

    console.log('Seeding Towns  ...');
    const townsRepo = dataSource.getRepository(Town);
    await townsRepo.save(townsList);
  }
}
