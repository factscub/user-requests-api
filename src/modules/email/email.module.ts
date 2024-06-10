import { Module } from '@nestjs/common';
import { NullEmailService } from './nullEmail.service';
import { ConfigService } from '@nestjs/config';
import { RealEmailService } from './realEmail.service';
import { MailerService } from '@nestjs-modules/mailer';

/**
 * MailerModule is responsible for providing the appropriate email service
 * based on the configuration setting. It can either provide a NullEmailService
 * for environments where real email sending is not required or RealEmailService
 * for actual email sending.
 */
@Module({
  providers: [
    {
      provide: 'EMAIL_SERVICE',
      /**
       * Factory function to determine which email service to use based on the configuration.
       * @param configService - The ConfigService to access environment variables.
       * @param mailerService - The MailerService for sending real emails.
       * @returns An instance of either NullEmailService or RealEmailService.
       */
      useFactory: (
        configService: ConfigService,
        mailerService: MailerService,
      ) => {
        const useNullService = configService.get('USE_NULL_EMAIL_SERVICE');
        return useNullService === 'true'
          ? new NullEmailService()
          : new RealEmailService(mailerService);
      },
      inject: [ConfigService, MailerService],
    },
    RealEmailService,
    NullEmailService,
  ],
  exports: ['EMAIL_SERVICE'],
})
export class MailerModule {}
