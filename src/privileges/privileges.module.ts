import { Module } from '@nestjs/common';
import { PrivilegesService } from './privileges.service';
import { PrivilegesController } from './privileges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privilege } from './entities/privilege.entity';

@Module({
  controllers: [PrivilegesController],
  providers: [PrivilegesService],
  imports: [TypeOrmModule.forFeature([Privilege])],
})
export class PrivilegesModule {}
