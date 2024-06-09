import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

/**
 * Module for managing users within the application.
 */
@Module({
  /**
   * Import the TypeOrmModule to provide access to the User entity.
   * This makes the User entity available to the module and its components.
   */
  imports: [TypeOrmModule.forFeature([User])],

  /**
   * Declare the UsersService as a provider within the module.
   * This makes the UsersService available for dependency injection.
   */
  providers: [UsersService],

  /**
   * Export the UsersService provider to make it available for injection in other modules.
   * This allows other modules to consume the UsersService.
   */
  exports: [UsersService],
})
export class UsersModule {}
