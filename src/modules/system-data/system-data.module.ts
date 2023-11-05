import { Module } from '@nestjs/common';
import { SystemDataService } from './system-data.service';
import { SystemDataController } from './system-data.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { OrderStatusModule } from 'src/modules/order-status/order-status.module';
import { TierTypesModule } from 'src/modules/tier-types/tier-types.module';
import { PaymentMethodsModule } from 'src/modules/payment-methods/payment-methods.module';
import { ImageController } from 'src/modules/serve-images/image.controller';

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
