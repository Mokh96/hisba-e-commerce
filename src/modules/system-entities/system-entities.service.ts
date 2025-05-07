import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderStatusObject } from 'src/modules/orders/enums/order-status.enum';
import { Role as RoleEnum, rolesObject } from 'src/common/enums/roles.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { townsList, wilayasList } from './data/wilayas-towns';
import { OrderStatus } from './entities/order-status.entity';
import { Role } from './entities/role.entity';
import { Town } from './entities/town.entity';
import { Wilaya } from './entities/wilaya.entity';

@Injectable()
export class SystemEntitiesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(OrderStatus) private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(Wilaya) private readonly wilayaRepository: Repository<Wilaya>,
    @InjectRepository(Town) private readonly townRepository: Repository<Town>,
    private readonly userService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    // return; // if you want to skip the process

    // must be done in this order
    await this.createRoles();
    await this.createOrderStatus();
    await this.createWilayas();
    await this.createTowns();
    await this.createUsers();

    process.env.NODE_ENV === 'development' && console.log('✅ Seeding done');
  }

  async createRoles() {
    const exist = await this.roleRepository.exist();

    if (exist) return;

    await this.roleRepository.save(
      Object.entries(rolesObject).map(([key, roleId]) => ({
        id: +roleId,
        label: key,
      })),
    );
  }

  async createOrderStatus() {
    const exist = await this.orderStatusRepository.exist();

    if (exist) return;

    await this.orderStatusRepository.save(
      Object.entries(orderStatusObject).map(([key, roleId]) => ({
        id: +roleId,
        label: key,
      })),
    );
  }

  async createWilayas() {
    const exist = await this.wilayaRepository.exist();

    if (exist) return;

    await this.wilayaRepository.save(wilayasList);
  }

  async createTowns() {
    const exist = await this.townRepository.exist();

    if (exist) return;

    await this.townRepository.save(townsList);
  }

  async createUsers() {
    const exist = await this.userService.exist();

    if (exist) return;

    const password = '123456';
    const defaultUsers: (CreateUserDto & { roleId: RoleEnum })[] = [
      {
        username: 'superadmin',
        password,
        roleId: RoleEnum.SUPERADMIN,
      },
      {
        username: 'admin',
        password,
        roleId: RoleEnum.ADMIN,
      },
      {
        username: 'company',
        password,
        roleId: RoleEnum.COMPANY,
      },
    ];

    for (const user of defaultUsers) {
      await this.userService.create(user);
    }
  }
}
