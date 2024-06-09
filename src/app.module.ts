import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './modules/application/application.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuring the ConfigModule to access environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuring the MailerModule to send emails
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mailerConfig, // Configuration for mailer service
    }),

    // Configuring the TypeOrmModule to connect to the database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig, // Configuration for database connection
    }),

    // Importing the AuthModule to provide its functionality
    AuthModule,

    // Importing the ApplicationModule to provide its functionality
    ApplicationModule,
  ],
})
export class AppModule {}
