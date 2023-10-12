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
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { TiersModule } from './tiers/tiers.module';
import { ProspectiveTiersModule } from './prospective-tiers/prospective-tiers.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from './ZodValidationPipe';
import { DelegatesModule } from './delegates/delegates.module';
import { RapportsModule } from './rapports/rapports.module';
import { TrackModule } from './track/track.module';
import { RolesModule } from './roles/roles.module';
import { TierTypesModule } from './tier-types/tier-types.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'hisba_e_commerce_dev',
      //entities: [User],
      //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    //DatabaseModule,
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
    CartsModule,
    CartItemsModule,
    ProfilesModule,
    PrivilegesModule,
    TiersModule,
    ProspectiveTiersModule,
    DelegatesModule,
    RapportsModule,
    TrackModule,
    RolesModule,
    TierTypesModule,
    PaymentMethodsModule,
  ],

  providers: [
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
