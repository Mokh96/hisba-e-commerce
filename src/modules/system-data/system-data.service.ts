import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { roles } from './data/roles';
import { orderStatus } from './data/order-status';
import { paymentMethods } from './data/payment-methods';
import { users } from './data/users';
import { UsersService } from '../users/users.service';

@Injectable()
export class SystemDataService {
  constructor(
    private usersService: UsersService,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,

    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}
  async create() {
    const userTest = await this.usersService.findOne(1);
    if (!userTest) {
      const _roles = this.roleRepository.create(roles);
      await this.roleRepository.save(_roles);

      const _orderStatus = this.orderStatusRepository.create(orderStatus);
      await this.orderStatusRepository.save(_orderStatus);

      const _paymentMethod =
        this.paymentMethodRepository.create(paymentMethods);
      await this.paymentMethodRepository.save(_paymentMethod);

      // const _users = this.usersService.create(users);
      // await this.usersService.save(_users);
    }

    return 'donne';
  }
}
