import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/common/utils/password.utils';
import { ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Module({
  imports: [
    // Importing the UsersModule to provide user-related functionality
    UsersModule,

    // Configuring the JwtModule for JWT token generation and validation
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  providers: [
    // Providing the AuthService for handling authentication logic
    AuthService,

    // Providing the PasswordService for hashing and comparing passwords
    PasswordService,

    // Providing the AuthGuard as a global guard to protect routes
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
