import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { FamiliesModule } from './families/families.module';
import { ProductsModule } from './products/products.module';
import { ProductGalleriesModule } from './product-galleries/product-galleries.module';
import { ArticleGalleriesModule } from './article-galleries/article-galleries.module';
import { OptionsModule } from './options/options.module';
import { OptionsValuesModule } from './options-values/options-values.module';
import { LotsModule } from './lots/lots.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { TiersModule } from './tiers/tiers.module';
import { ProspectiveTiersModule } from './prospective-tiers/prospective-tiers.module';
import { DelegatesModule } from './delegates/delegates.module';
import { RapportsModule } from './rapports/rapports.module';
import { TrackModule } from './track/track.module';
import { RolesModule } from './roles/roles.module';
import { TierTypesModule } from './tier-types/tier-types.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { ArticlesModule } from './articles/articles.module';
import { ShippingAddressesModule } from './shipping-addresses/shipping-addresses.module';
import { SystemDataModule } from './system-data/system-data.module';
import { GlobalExceptionFilter } from './error-handlers/global-handler';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'hisba_e_commerce_dev',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
    }),
    UsersModule,
    CategoriesModule,
    BrandsModule,
    FamiliesModule,
    ProductsModule,
    ProductGalleriesModule,
    ArticleGalleriesModule,
    OptionsModule,
    OptionsValuesModule,
    LotsModule,
    OrderItemsModule,
    OrdersModule,
    OrderStatusModule,
    OrderHistoryModule,
    CartItemsModule,
    TiersModule,
    ProspectiveTiersModule,
    DelegatesModule,
    RapportsModule,
    TrackModule,
    RolesModule,
    TierTypesModule,
    PaymentMethodsModule,
    ArticlesModule,
    ShippingAddressesModule,
    SystemDataModule,
    AuthModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
