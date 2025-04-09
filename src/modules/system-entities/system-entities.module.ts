import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { OrderStatus } from './entities/order-status.entity';
import { Role } from './entities/role.entity';
import { Town } from './entities/town.entity';
import { Wilaya } from './entities/wilaya.entity';
import { SystemEntitiesService } from './system-entities.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Town, Wilaya, Role, OrderStatus])],

  providers: [SystemEntitiesService],
})
export class SystemEntitiesModule {}
