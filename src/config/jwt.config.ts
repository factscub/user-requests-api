import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Asynchronous function to generate options for JWT module configuration.
 * @param configService - The ConfigService instance to retrieve configuration values.
 * @returns A Promise resolving to the JWT module options.
 */
export const jwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  // Retrieve JWT_SECRET and JWT_TOKEN_EXPIRY from configuration and construct options object.
  return {
    global: true, // Indicates that JWT configuration is applied globally.
    secret: configService.get<string>('JWT_SECRET'), // Retrieve JWT secret from environment variable.
    signOptions: {
      expiresIn: configService.get<string>('JWT_TOKEN_EXPIRY'), // Retrieve token expiry duration from configuration.
    },
  };
};
