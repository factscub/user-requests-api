import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ConfigService } from '@nestjs/config';

/**
 * Factory function that returns mailer options based on configuration provided by ConfigService.
 * This function asynchronously retrieves mailer configuration values from the ConfigService.
 * @param configService The ConfigService instance used to retrieve configuration values.
 * @returns Promise<MailerOptions> A promise that resolves to mailer options.
 */
export const mailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  return {
    transport: {
      host: configService.get<string>('MAILER_HOST'), // SMTP server host address
      port: configService.get<number>('MAILER_PORT'), // SMTP server port number
      auth: {
        user: configService.get<string>('MAILER_AUTH_USER'), // SMTP server authentication username
        pass: configService.get<string>('MAILER_AUTH_PASSWORD'), // SMTP server authentication password
      },
    },
    defaults: {
      from: configService.get<string>('MAILER_FROM_EMAIL'), // Default email sender address
    },
  };
};
