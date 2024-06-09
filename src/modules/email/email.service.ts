import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplatesNames } from './enums/templates.enum';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNotificationEmail(
    toEmail: string,
    subject: string,
    templateName: string,
    context?: object,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: toEmail,
      subject: subject,
      html: this.sendMailFactory(templateName, context),
    });
  }

  sendMailFactory(templateName: string, context: object) {
    if (templateName === TemplatesNames.APPLICATION_RECEIVED) {
      return this.applicationReceived(context);
    } else if (templateName === TemplatesNames.APPLICATION_RESOLVED) {
      return this.applicationResolved(context);
    }
  }

  applicationReceived({ name, message, created_at }: any) {
    created_at = new Date(created_at);
    return `
        <h1>Hello, ${name}!</h1>
        <p>Your application has been received at
        ${created_at.toLocaleString()}
        </p>
        <p>Your Message: ${message}</p>
    `;
  }

  applicationResolved({ name, message, comment, updated_at }: any) {
    updated_at = new Date(updated_at);
    return `
        <h1>Hello, ${name}!</h1>
        <p>Your Message: ${message}</p>
        <p>Your application has been Resolved at
        ${updated_at.toLocaleString()}
        </p>
        <p>Our Comment: ${comment}</p>
    `;
  }
}
