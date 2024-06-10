import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Application } from 'src/modules/application/entities/application.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';

/**
 * Factory function that returns TypeORM module options based on configuration provided by ConfigService.
 * This function asynchronously retrieves database configuration values from the ConfigService.
 * @param configService The ConfigService instance used to retrieve configuration values.
 * @returns Promise<TypeOrmModuleOptions> A promise that resolves to TypeORM module options.
 */
export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'), // Database host address
    port: configService.get<number>('DATABASE_PORT'), // Database port number
    username: configService.get<string>('DATABASE_USERNAME'), // Database username
    password: configService.get<string>('DATABASE_PASSWORD'), // Database password
    entities: [Application, User], // List of entities (database tables) to be synchronized
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'), // Whether to auto-create database tables based on entity definitions
    database: configService.get<string>('DATABASE_NAME'),
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
