import { Module } from '@nestjs/common';
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
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { ClientsModule } from './clients/clients.module';
import { RolesModule } from './roles/roles.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { ArticlesModule } from './articles/articles.module';
import { ShippingAddressesModule } from './shipping-addresses/shipping-addresses.module';
import { SystemDataModule } from './system-data/system-data.module';
import {
  GlobalExceptionFilter,
  NotFoundExceptionFilter,
} from 'src/error-handlers/global-handler';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';

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

    UsersModule,
    CategoriesModule,
    BrandsModule,
    FamiliesModule,
    ProductsModule,
    ProductGalleriesModule,
    ArticleGalleriesModule,
    OptionsModule,
    OptionsValuesModule,
    OrderItemsModule,
    OrdersModule,
    OrderStatusModule,
    OrderHistoryModule,
    CartItemsModule,
    ClientsModule,
    RolesModule,
    PaymentMethodsModule,
    ArticlesModule,
    ShippingAddressesModule,
    SystemDataModule,
    AuthModule,
    FilesModule,
  ],

  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
