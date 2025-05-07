import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, JWT_SECRET } from 'src/common/constants/jwt.contant';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { Client } from 'src/modules/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([Client]),
    UsersModule,
    ClientsModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
})
export class AuthModule {}
