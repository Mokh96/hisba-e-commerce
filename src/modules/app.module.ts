import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { OptionsValuesModule } from './options-values/options-values.module';
import { OptionsModule } from './options/options.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { ProductGalleriesModule } from './product-galleries/product-galleries.module';
import { ProductsModule } from './products/products.module';
import { ShippingAddressesModule } from './shipping-addresses/shipping-addresses.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FilesModule } from './files/files.module';
import { SystemEntitiesModule } from './system-entities/system-entities.module';
import { ExceptionModule } from 'src/common/exceptions/exception.module';
import { I18nModule } from 'src/startup/i18n/i18n.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'new_ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
      logging: false,
    }),
    I18nModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    ProductGalleriesModule,
    OptionsModule,
    OptionsValuesModule,
    OrderItemsModule,
    OrdersModule,
    OrderHistoryModule,
    CartItemsModule,
    ClientsModule,
    PaymentMethodsModule,
    ArticlesModule,
    ShippingAddressesModule,
    AuthModule,
    FilesModule,
    SystemEntitiesModule,
    ExceptionModule
  ],

  providers: [
/*    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },*/
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
