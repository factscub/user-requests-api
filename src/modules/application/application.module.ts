import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { MailerModule } from 'src/modules/email/email.module';

/**
 * The ApplicationModule is responsible for handling application-related functionality.
 * It imports the necessary modules, registers controllers and providers.
 */
@Module({
  imports: [
    // Importing TypeOrmModule to work with the Application entity
    TypeOrmModule.forFeature([Application]),

    // Importing MailerModule to handle email functionalities
    MailerModule,
  ],
  controllers: [
    // Registering the ApplicationController to handle incoming HTTP requests
    ApplicationController,
  ],
  providers: [
    // Registering the ApplicationService to handle business logic
    ApplicationService,
  ],
})
export class ApplicationModule {}
