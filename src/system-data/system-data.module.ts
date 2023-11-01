import { Module } from '@nestjs/common';
import { SystemDataService } from './system-data.service';
import { SystemDataController } from './system-data.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { OrderStatusModule } from 'src/order-status/order-status.module';
import { TierTypesModule } from 'src/tier-types/tier-types.module';
import { PaymentMethodsModule } from 'src/payment-methods/payment-methods.module';
import { ImageController } from 'src/serve-images/image.controller';

@Module({
  controllers: [SystemDataController, ImageController],
  imports: [
    UsersModule,
    RolesModule,
    OrderStatusModule,
    TierTypesModule,
    OrderStatusModule,
    PaymentMethodsModule,
  ],
  providers: [SystemDataService],
})
export class SystemDataModule {}
