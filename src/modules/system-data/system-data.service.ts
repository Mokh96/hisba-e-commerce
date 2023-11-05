import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { TierType } from 'src/modules/tier-types/entities/tier-type.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { roles } from './data/roles';
import { orderStatus } from './data/order-status';
import { tierTypes } from './data/tier-types';
import { paymentMethods } from './data/payment-methods';
import { users } from './data/users';

@Injectable()
export class SystemDataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,

    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,

    @InjectRepository(TierType)
    private tierTypeRepository: Repository<TierType>,
  ) {}
  async create() {
    const userTest = await this.usersRepository.findOne({ where: { id: 1 } });
    if (!userTest) {
      const _roles = this.roleRepository.create(roles);
      await this.roleRepository.save(_roles);

      const _orderStatus = this.orderStatusRepository.create(orderStatus);
      await this.orderStatusRepository.save(_orderStatus);

      const _paymentMethod =
        this.paymentMethodRepository.create(paymentMethods);
      await this.paymentMethodRepository.save(_paymentMethod);

      const _tierType = this.tierTypeRepository.create(tierTypes);
      await this.tierTypeRepository.save(_tierType);

      const _users = this.usersRepository.create(users);
      await this.usersRepository.save(_users);
    }

    return 'donne';
  }
}
